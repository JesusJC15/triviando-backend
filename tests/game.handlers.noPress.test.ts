import { jest } from '@jest/globals';

function createFakeIO() {
  const events: any[] = [];
  const io: any = {
    to: jest.fn(() => ({ emit: jest.fn((evt: string, payload: any) => { events.push({ evt, payload }); }) })),
    events,
  };
  return io;
}

function createFakeSocket(user = { id: 'host1', name: 'Host' }) {
  const handlers: Record<string, Function> = {};
  const socket: any = {
    data: { user },
    on: (evt: string, cb: Function) => { handlers[evt] = cb; },
    emit: jest.fn(),
    trigger: async (evt: string, payload?: any, ack?: Function) => handlers[evt]?.(payload ?? {}, ack),
  };
  return socket;
}

// Mocks
const redisGet = jest.fn();
const redisSet = jest.fn();
const redisDel = jest.fn();
const redisSAdd = jest.fn();
const redisExpire = jest.fn();
jest.mock('../src/config/redis', () => ({ __esModule: true, default: {
  get: (...a:any[]) => redisGet(...a),
  set: (...a:any[]) => redisSet(...a),
  del: (...a:any[]) => redisDel(...a),
  sadd: (...a:any[]) => redisSAdd(...a),
  expire: (...a:any[]) => redisExpire(...a),
} }));

const Room = { findOne: jest.fn((q:any) => ({ lean: () => Promise.resolve({ code: q.code, hostId: 'host1', triviaId: 't1', players: [{ userId:'host1', name:'Host' }], status: 'waiting' }) })), findOneAndUpdate: jest.fn(()=>({ exec: async ()=>({}) })) };
jest.mock('../src/models/room.model', () => ({ __esModule: true, Room }));

const Trivia = { findById: jest.fn(()=>({ lean: () => ({ _id:'t1', questions:[{ question:'Q', options:['a','b'], correctAnswer:'a' }] }) })) };
jest.mock('../src/models/trivia.model', () => ({ __esModule: true, Trivia }));

const GameResult = { findOne: jest.fn(()=>Promise.resolve(null)), create: jest.fn(async()=>({})) };
jest.mock('../src/models/gameResult.model', () => ({ __esModule: true, GameResult }));

let mockState: any = null;
const initGameState = jest.fn(async ()=>{});
const getGameState = jest.fn(async () => mockState);
const saveGameState = jest.fn(async (_c:string, s:any)=> { mockState = JSON.parse(JSON.stringify(s)); });
// Capture scheduled timers so tests can advance them deterministically
const timers: Record<string, Function> = {};
const scheduleTimer = jest.fn((key: string, fn: ()=>void, _d?:number)=> { timers[key] = fn; });
const clearTimer = jest.fn();
const attemptFirstPress = jest.fn(async ()=> true);
const resetFirstPress = jest.fn(async ()=> {});
const dedupeEvent = jest.fn(async ()=> true);
const clearAnswerWindow = jest.fn();

jest.mock('../src/services/game.service', () => ({ __esModule: true,
  initGameState: (...a:any[]) => initGameState(...a),
  getGameState: (...a:any[]) => getGameState(...a),
  saveGameState: (...a:any[]) => saveGameState(...a),
  scheduleTimer: (...a:any[]) => scheduleTimer(...a),
  clearTimer: (...a:any[]) => clearTimer(...a),
  attemptFirstPress: (...a:any[]) => attemptFirstPress(...a),
  resetFirstPress: (...a:any[]) => resetFirstPress(...a),
  dedupeEvent: (...a:any[]) => dedupeEvent(...a),
  clearAnswerWindow: (...a:any[]) => clearAnswerWindow(...a),
  DEFAULT_QUESTION_READ_MS: 1,
  MIN_BUTTON_DELAY_MS: 0,
  MAX_BUTTON_DELAY_MS: 0,
  PRESS_WINDOW_MS: 1,
  ANSWER_TIMEOUT_MS: 5,
}));

import { registerGameHandlers } from '../src/socket/game.handlers';

describe('startRound -> handleNoPresses', () => {
  beforeEach(() => { jest.clearAllMocks(); mockState = null; });

  it('when nobody presses, round:result emitted and question advances', async () => {
    const io = createFakeIO();
    const socketHost = createFakeSocket({ id:'host1', name:'Host' });
    registerGameHandlers(io as any, socketHost as any);

    // Prepare initial state returned after init
    mockState = {
      roomCode: 'ROOMX', triviaId: 't1', status: 'in-game',
      currentQuestionIndex: 0, roundSequence: 0, scores: { host1:0 }, blocked: {},
      players: [{ userId:'host1', name:'Host' }],
    };

    // Trigger game:start as host to start a round. scheduleTimer captures timers instead of executing them.
    await socketHost.trigger('game:start', { code: 'ROOMX' }, (resp:any) => {
      expect(resp.ok).toBe(true);
    });

    // After startRound runs, scheduleTimer should have registered an openButton timer.
    const roundSeq = mockState.roundSequence;
    const openKey = `ROOMX:openButton:${roundSeq}`;
    const pressKey = `ROOMX:pressWindow:${roundSeq}`;
    // ensure the openButton timer was scheduled
    expect(Object.keys(timers)).toContain(openKey);

    // Execute openButton timer (this will register the pressWindow timer)
    await timers[openKey]();

    // Now the pressWindow timer should be scheduled
    expect(Object.keys(timers)).toContain(pressKey);

    // Advance the press window to simulate nobody pressing
    await timers[pressKey]();

    // Should have emitted a round:result revealing the answer because nobody pressed
    expect(io.events.some(e => e.evt === 'round:result')).toBe(true);
    // state should have advanced question index
    expect(mockState.currentQuestionIndex).toBeGreaterThanOrEqual(1);
  });
});

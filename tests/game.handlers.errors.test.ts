import { jest } from '@jest/globals';

function createFakeIO() {
  const events: any[] = [];
  const io: any = {
    to: jest.fn(() => ({ emit: jest.fn((evt: string, payload: any) => { events.push({ evt, payload }); }) })),
    events,
  };
  return io;
}

function createFakeSocket(user = { id: 'u1', name: 'Alice' }) {
  const handlers: Record<string, Function> = {};
  const socket: any = {
    data: { user },
    on: (evt: string, cb: Function) => { handlers[evt] = cb; },
    emit: jest.fn(),
    trigger: async (evt: string, payload?: any, ack?: Function) => handlers[evt]?.(payload ?? {}, ack),
  };
  return socket;
}

// basic redis mock
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

// Room mock
const Room = { findOne: jest.fn((q:any) => ({ lean: () => Promise.resolve(q.code === 'ROOM' ? { code: 'ROOM', hostId: 'host1', triviaId: 't1', players: [{ userId: 'host1', name: 'Host' }] } : null) })), findOneAndUpdate: jest.fn(()=>({ exec: async ()=>({}) })) };
jest.mock('../src/models/room.model', () => ({ __esModule: true, Room }));

// Trivia mock (will override in tests where needed)
const Trivia = { findById: jest.fn(()=>({ lean: () => ({ _id: 't1', questions: [ { question: 'Q', options: ['a','b'], correctAnswer: 'a' } ] }) })) };
jest.mock('../src/models/trivia.model', () => ({ __esModule: true, Trivia }));

const GameResult = { findOne: jest.fn(()=>Promise.resolve(null)), create: jest.fn(async()=>({})) };
jest.mock('../src/models/gameResult.model', () => ({ __esModule: true, GameResult }));

let mockState: any = null;
const getGameState = jest.fn(async () => mockState);
const saveGameState = jest.fn(async (_c:string, s:any)=> { mockState = JSON.parse(JSON.stringify(s)); });
const timers: Record<string, Function> = {};
const scheduleTimer = jest.fn((key: string, fn: ()=>void, _d?:number)=> { timers[key] = fn; });
const clearTimer = jest.fn();
const attemptFirstPress = jest.fn(async ()=> true);
const resetFirstPress = jest.fn(async ()=> {});
const dedupeEvent = jest.fn(async ()=> true);
const clearAnswerWindow = jest.fn();

jest.mock('../src/services/game.service', () => ({ __esModule: true,
  initGameState: jest.fn(),
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

describe('game.handlers errors/messages', () => {
  beforeEach(() => { jest.clearAllMocks(); for(const k in timers) delete timers[k]; mockState = null; });

  it('round:buttonPress throws Question not found when trivia missing', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id: 'u1', name: 'Alice' });
    registerGameHandlers(io as any, socket as any);

    mockState = {
      roomCode: 'X', triviaId: 'missing', status: 'open', currentQuestionIndex: 0, roundSequence: 1, scores: {}, blocked: {},
      players: [{ userId: 'u1', name: 'Alice' }],
    };

    // Make Trivia.findById return null
    (Trivia.findById as jest.Mock).mockReturnValueOnce({ lean: () => Promise.resolve(null) });

    let ackResp: any = null;
    await socket.trigger('round:buttonPress', { code: 'X', roundSequence: 1 }, (resp:any) => { ackResp = resp; });

    expect(ackResp).not.toBeNull();
    expect(ackResp.ok).toBe(false);
    expect(ackResp.error).toMatch(/Question not found/i);
  });

  it('game:start returns error when initGameState throws', async () => {
    const io = createFakeIO();
    const socketHost = createFakeSocket({ id: 'host1', name: 'Host' });
    registerGameHandlers(io as any, socketHost as any);

    // ensure Room.findOne returns a room (Room mock already does for code 'ROOM')
    // Make initGameState throw (use require to access the mocked module)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const svc = require('../src/services/game.service');
    (svc.initGameState as jest.Mock).mockImplementationOnce(async () => { throw new Error('init failed'); });

    let ackResp: any = null;
    await socketHost.trigger('game:start', { code: 'ROOM' }, (resp:any) => { ackResp = resp; });

    expect(ackResp).not.toBeNull();
    expect(ackResp.ok).toBe(false);
    expect(ackResp.error).toMatch(/init failed/i);
  });

  it('round:answer rejects with Round mismatch when state missing or sequence mismatch', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id: 'u1', name: 'Alice' });
    registerGameHandlers(io as any, socket as any);

    // case: state missing
    mockState = null;
    let ackResp: any = null;
    await socket.trigger('round:answer', { code: 'X', roundSequence: 999, selectedIndex: 0 }, (resp:any) => { ackResp = resp; });
    expect(ackResp.ok).toBe(false);
    expect(ackResp.message).toMatch(/Round mismatch/i);

    // case: sequence mismatch
    mockState = { roomCode: 'X', triviaId: 't1', status: 'open', currentQuestionIndex: 0, roundSequence: 2, scores: {}, blocked: {}, players: [] };
    ackResp = null;
    await socket.trigger('round:answer', { code: 'X', roundSequence: 3, selectedIndex: 0 }, (resp:any) => { ackResp = resp; });
    expect(ackResp.ok).toBe(false);
    expect(ackResp.message).toMatch(/Round mismatch/i);
  });
});

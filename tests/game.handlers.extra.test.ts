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

const Room = { findOne: jest.fn((q:any) => ({ lean: () => Promise.resolve(null) })), findOneAndUpdate: jest.fn(()=>({ exec: async ()=>({}) })) };
jest.mock('../src/models/room.model', () => ({ __esModule: true, Room }));

const Trivia = { findById: jest.fn(()=>({ lean: () => ({ _id:'t1', questions:[{ question:'Q', options:['a','b'], correctAnswer:'a' }] }) })) };
jest.mock('../src/models/trivia.model', () => ({ __esModule: true, Trivia }));

const GameResult = { findOne: jest.fn(()=>Promise.resolve(null)), create: jest.fn(async()=>({})) };
jest.mock('../src/models/gameResult.model', () => ({ __esModule: true, GameResult }));

let mockState: any = null;
const getGameState = jest.fn(async () => mockState);
const saveGameState = jest.fn(async (_c:string, s:any)=> { mockState = JSON.parse(JSON.stringify(s)); });
const scheduleTimer = jest.fn((_k:string, fn:()=>void, _d?:number)=>{});
const clearTimer = jest.fn();
const attemptFirstPress = jest.fn(async ()=> true);
const resetFirstPress = jest.fn(async ()=> {});
const dedupeEvent = jest.fn(async ()=> true);

jest.mock('../src/services/game.service', () => ({ __esModule: true,
  initGameState: jest.fn(),
  getGameState: (...a:any[]) => getGameState(...a),
  saveGameState: (...a:any[]) => saveGameState(...a),
  scheduleTimer: (...a:any[]) => scheduleTimer(...a),
  clearTimer: (...a:any[]) => clearTimer(...a),
  attemptFirstPress: (...a:any[]) => attemptFirstPress(...a),
  resetFirstPress: (...a:any[]) => resetFirstPress(...a),
  dedupeEvent: (...a:any[]) => dedupeEvent(...a),
  clearAnswerWindow: jest.fn(),
  DEFAULT_QUESTION_READ_MS: 1,
  MIN_BUTTON_DELAY_MS: 0,
  MAX_BUTTON_DELAY_MS: 0,
  PRESS_WINDOW_MS: 1,
  ANSWER_TIMEOUT_MS: 5,
}));

import { registerGameHandlers } from '../src/socket/game.handlers';

describe('game.handlers extra branches', () => {
  beforeEach(() => { jest.clearAllMocks(); mockState = null; });

  it('game:start requires room code', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id:'u1', name:'Alice' });
    registerGameHandlers(io as any, socket as any);

    await socket.trigger('game:start', {}, (resp:any) => {
      expect(resp.ok).toBe(false);
      expect(resp.message).toMatch(/Room code required/i);
    });
  });

  it('game:start returns not found when room missing', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id:'u1', name:'Alice' });
    registerGameHandlers(io as any, socket as any);

    await socket.trigger('game:start', { code: 'NO_EXIST' }, (resp:any) => {
      expect(resp.ok).toBe(false);
      expect(resp.message).toMatch(/Room not found/i);
    });
  });

  it('round:buttonPress duplicate event is ignored', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id:'u1', name:'Alice' });
    registerGameHandlers(io as any, socket as any);

    mockState = { roomCode: 'X', triviaId: 't1', status:'open', currentQuestionIndex:0, roundSequence: 1, scores:{}, blocked:{}, players:[{ userId:'u1', name:'Alice' }] };
    (dedupeEvent as jest.Mock).mockResolvedValueOnce(false);

    await socket.trigger('round:buttonPress', { code: 'X', roundSequence: 1, eventId: 'dup' }, (resp:any)=>{
      expect(resp.ok).toBe(true);
      expect(resp.message).toMatch(/Evento duplicado ignorado/i);
    });
  });

  it('round:answer duplicate event is ignored', async () => {
    const io = createFakeIO();
    const socket = createFakeSocket({ id:'u1', name:'Alice' });
    registerGameHandlers(io as any, socket as any);

    mockState = { roomCode: 'X', triviaId: 't1', status:'answering', currentQuestionIndex:0, roundSequence: 5, scores:{}, blocked:{}, players:[{ userId:'u1', name:'Alice' }] };
    (dedupeEvent as jest.Mock).mockResolvedValueOnce(false);

    await socket.trigger('round:answer', { code: 'X', roundSequence: 5, selectedIndex: 0, eventId: 'dup2' }, (resp:any)=>{
      expect(resp.ok).toBe(true);
      expect(resp.message).toMatch(/Evento duplicado ignorado/i);
    });
  });
});

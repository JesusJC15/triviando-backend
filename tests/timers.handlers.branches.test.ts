import { jest } from '@jest/globals';

// Mock game service helpers used by timers.handlers
const getGameStateMock = jest.fn();
const saveGameStateMock = jest.fn();
const clearAnswerWindowMock = jest.fn();
const resetFirstPressMock = jest.fn();
const scheduleTimerMock = jest.fn();

jest.mock('../src/services/game.service', () => ({
  __esModule: true,
  getGameState: (...args: any[]) => getGameStateMock(...args),
  saveGameState: (...args: any[]) => saveGameStateMock(...args),
  clearAnswerWindow: (...args: any[]) => clearAnswerWindowMock(...args),
  resetFirstPress: (...args: any[]) => resetFirstPressMock(...args),
  scheduleTimer: (...args: any[]) => scheduleTimerMock(...args),
}));

// Mock redis to control firstPress checks
jest.mock('../src/config/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(async () => null),
  },
}));

// Mock Trivia and GameResult models
const findByIdMock = jest.fn();
const gameResultFindOneMock = jest.fn();
const gameResultCreateMock = jest.fn();

jest.mock('../src/models/trivia.model', () => ({
  __esModule: true,
  Trivia: { findById: (...args: any[]) => findByIdMock(...args) },
}));

jest.mock('../src/models/gameResult.model', () => ({
  __esModule: true,
  GameResult: {
    findOne: (...args: any[]) => gameResultFindOneMock(...args),
    create: (...args: any[]) => gameResultCreateMock(...args),
  },
}));

// Simple io stub
function makeIo() {
  const emitSpy = jest.fn();
  return {
    to: () => ({ emit: emitSpy }),
    _emitSpy: emitSpy,
  } as any;
}

// Import module under test after mocks
const timers = require('../src/services/timers.handlers');

describe('timers.handlers branches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getGameStateMock.mockResolvedValue(null);
    findByIdMock.mockResolvedValue(null);
    gameResultFindOneMock.mockResolvedValue(null);
    gameResultCreateMock.mockResolvedValue(null);
  });

  it('handleWinnerTimeoutSafe returns early when no state or status mismatch', async () => {
    getGameStateMock.mockResolvedValueOnce(null);
    const io = makeIo();
    await timers.handleWinnerTimeoutSafe(io as any, 'C', 1, 'u1');
    expect(saveGameStateMock).not.toHaveBeenCalled();

    getGameStateMock.mockResolvedValueOnce({ roundSequence: 2, status: 'not-answering' });
    await timers.handleWinnerTimeoutSafe(io as any, 'C', 1, 'u1');
    expect(saveGameStateMock).not.toHaveBeenCalled();
  });

  it('handleWinnerTimeoutSafe finalizes when answerWindow expired', async () => {
    const now = Date.now();
    getGameStateMock.mockResolvedValueOnce({ roundSequence: 1, status: 'answering', answerWindowEndsAt: now - 100, players: [{ userId: 'u1' }], scores: { u1: 0 } });
    const io = makeIo();

    // Spy startRoundOpenButtonAgain to avoid executing its logic on timer
    const spyStartAgain = jest.spyOn(timers, 'startRoundOpenButtonAgain').mockImplementation(() => Promise.resolve());

    jest.useFakeTimers();
    await timers.handleWinnerTimeoutSafe(io as any, 'C', 1, 'u1');
    // advance timers to trigger setTimeout that calls startRoundOpenButtonAgain
    jest.advanceTimersByTime(1500);

    expect(saveGameStateMock).toHaveBeenCalled();
    expect(io._emitSpy).toHaveBeenCalled();
    expect(resetFirstPressMock).toHaveBeenCalled();

    spyStartAgain.mockRestore();
    jest.useRealTimers();
  });

  it('startRoundOpenButtonAgain opens button when eligible exists', async () => {
    const state = { roundSequence: 3, players: [{ userId: 'a' }], blocked: { a: false } };
    getGameStateMock.mockResolvedValueOnce(state);
    const io = makeIo();
    await timers.startRoundOpenButtonAgain(io as any, 'Z', 3);
    expect(resetFirstPressMock).toHaveBeenCalled();
    expect(saveGameStateMock).toHaveBeenCalled();
    expect(io._emitSpy).toHaveBeenCalled();
    expect(scheduleTimerMock).toHaveBeenCalled();
  });
});

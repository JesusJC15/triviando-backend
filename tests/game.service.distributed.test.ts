import { jest } from '@jest/globals';

// Mock the timers queue helpers
const scheduleTimerJobMock = jest.fn();
const removeTimerJobMock = jest.fn();

// Prevent the real redis client from connecting when we flip NODE_ENV
jest.mock('../src/config/redis', () => ({
  __esModule: true,
  default: {
    set: jest.fn(async () => null),
    get: jest.fn(async () => null),
    del: jest.fn(async () => null),
    incr: jest.fn(async () => null),
    expire: jest.fn(async () => null),
    sadd: jest.fn(async () => null),
  },
}));

jest.mock('../src/queues/timers.queue', () => ({
  __esModule: true,
  scheduleTimerJob: (...args: any[]) => scheduleTimerJobMock(...args),
  removeTimerJob: (...args: any[]) => removeTimerJobMock(...args),
}));

describe('game.service distributed timers', () => {
  const realEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    // simulate production with REDIS configured
    process.env = { ...realEnv, NODE_ENV: 'production', REDIS_URL: 'redis://127.0.0.1:6379' };
    scheduleTimerJobMock.mockClear();
    removeTimerJobMock.mockClear();
  });

  afterEach(() => {
    process.env = realEnv;
    jest.clearAllMocks();
  });

  it('scheduleDistributedAnswerTimeout enqueues job when not test and REDIS_URL set', async () => {
    const { scheduleDistributedAnswerTimeout } = require('../src/services/game.service');
    await scheduleDistributedAnswerTimeout('job1', { x: 1 }, 1500);
    expect(scheduleTimerJobMock).toHaveBeenCalledWith('job1', 'answerTimeout', 1500, { x: 1 });
  });

  it('clearDistributedTimer calls removeTimerJob when not test and REDIS_URL set', async () => {
    const { clearDistributedTimer } = require('../src/services/game.service');
    await clearDistributedTimer('job-abc');
    expect(removeTimerJobMock).toHaveBeenCalledWith('job-abc');
  });

  it('does not enqueue when NODE_ENV is test', async () => {
    process.env.NODE_ENV = 'test';
    const { scheduleDistributedAnswerTimeout } = require('../src/services/game.service');
    await scheduleDistributedAnswerTimeout('job2', {}, 10);
    expect(scheduleTimerJobMock).not.toHaveBeenCalled();
  });
});

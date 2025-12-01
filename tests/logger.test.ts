import { jest } from '@jest/globals';

describe('logger', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;

  afterEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = ORIGINAL_ENV;
    jest.restoreAllMocks();
  });

  test('provides test proxy logger when NODE_ENV=test', () => {
    process.env.NODE_ENV = 'test';
    jest.resetModules();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // import after setting env
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../src/utils/logger').default;

    expect(logger).toBeDefined();
    logger.info('a', 1);
    logger.warn('b', 2);
    logger.error('c', 3);

    expect(consoleLogSpy).toHaveBeenCalledWith('a', 1);
    expect(consoleWarnSpy).toHaveBeenCalledWith('b', 2);
    expect(consoleErrorSpy).toHaveBeenCalledWith('c', 3);
  });

  test('provides pino logger when NODE_ENV=development', () => {
    process.env.NODE_ENV = 'development';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../src/utils/logger').default;

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
    // child should return a logger-like object
    const child = logger.child({ module: 'test' });
    expect(child).toBeDefined();
    expect(typeof child.info).toBe('function');
  });

  test('provides pino logger when NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const logger = require('../src/utils/logger').default;

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    // ensure not the test proxy (which uses console.log)
    expect(logger.info).not.toBe(console.log);
  });
});

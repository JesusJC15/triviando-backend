import { jest } from '@jest/globals';

test('test proxy logger child returns proxy in test env', () => {
  const ORIGINAL_ENV = process.env.NODE_ENV;
  process.env.NODE_ENV = 'test';
  jest.resetModules();

  const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const logger = require('../src/utils/logger').default;
  const child = logger.child();
  expect(child).toBeDefined();
  child.info('x');
  child.warn('y');
  child.error('z');

  expect(consoleLogSpy).toHaveBeenCalled();
  expect(consoleWarnSpy).toHaveBeenCalled();
  expect(consoleErrorSpy).toHaveBeenCalled();

  // restore
  process.env.NODE_ENV = ORIGINAL_ENV;
  jest.resetModules();
  jest.restoreAllMocks();
});

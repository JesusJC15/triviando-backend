import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV !== 'production' && !isTest;

const testLogger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  child: () => testLogger,
} as const;

// Avoid creating pino transport worker during tests or inside Jest workers
const enableTransport = isDev && !isTest && typeof process.env.JEST_WORKER_ID === 'undefined' && !process.env.DISABLE_PINO_TRANSPORT;

const logger = isTest
  ? testLogger
  : pino({
      level: process.env.LOG_LEVEL || 'info',
      base: null,
      timestamp: pino.stdTimeFunctions.isoTime,
      transport: enableTransport
        ? {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          }
        : undefined,
    });

export default logger;

import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isDev = process.env.NODE_ENV !== 'production' && !isTest;

const testLogger = {
  info: (...args: any[]) => console.log(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  child: () => testLogger,
} as const;

const logger = isTest
  ? testLogger
  : pino({
      level: process.env.LOG_LEVEL || 'info',
      base: null,
      timestamp: pino.stdTimeFunctions.isoTime,
      transport: isDev
        ? {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          }
        : undefined,
    });

export default logger;

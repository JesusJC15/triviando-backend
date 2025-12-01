import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://default:password@host:port";

const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

import logger from "../utils/logger";

redis.on("connect", () => logger.info("Connected to Redis Cloud"));
redis.on("error", (err) => logger.error({ err: (err as any)?.message || err }, "Redis error"));

export default redis;
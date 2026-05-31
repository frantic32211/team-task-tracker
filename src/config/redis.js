import Redis from "ioredis";
import { env } from "./env.js";

export const redis = new Redis({
  host: env.REDIS_CLIENT_HOST,
  port: env.REDIS_CLIENT_PORT,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

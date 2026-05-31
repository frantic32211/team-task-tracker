import { redis } from "../config/redis.js";

export const clearTaskCache = async (organizationId) => {
  try {
    const pattern = `tasks:${organizationId}:*`;

    let cursor = "0";

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );

      cursor = nextCursor;

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error) {
    console.error("Redis cache clear error:", error.message);
  }
};

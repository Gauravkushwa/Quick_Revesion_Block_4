/**
 * Redis client configuration
 * Exports a single shared Redis instance across the app.
 */
const { createClient } = require("redis");
let redisClient;

async function initRedis() {
  if (!redisClient) {
    redisClient = createClient({ url: process.env.REDIS_URL });
    redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
    await redisClient.connect();
    console.log("✅ Connected to Redis");
  }
  return redisClient;
}

function getRedis() {
  if (!redisClient) throw new Error("Redis not initialized!");
  return redisClient;
}

module.exports = { initRedis, getRedis };

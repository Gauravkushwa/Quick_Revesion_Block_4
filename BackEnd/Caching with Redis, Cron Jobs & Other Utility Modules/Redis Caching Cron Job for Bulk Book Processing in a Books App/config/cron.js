/**
 * Cron job setup for bulk book insertion
 * Runs every 2 minutes, processes pending bulk inserts in Redis.
 */
const cron = require("node-cron");
const { getRedis } = require("./redis");
const { insertBulkBooksFromRedis } = require("../services/bookService");

function setupCronJobs() {
  cron.schedule("*/2 * * * *", async () => {
    console.log(`[CRON] Running bulk insert at ${new Date().toISOString()}`);
    try {
      const redis = getRedis();
      await insertBulkBooksFromRedis(redis);
    } catch (err) {
      console.error("[CRON] Bulk insert failed:", err);
    }
  });
}

module.exports = { setupCronJobs };

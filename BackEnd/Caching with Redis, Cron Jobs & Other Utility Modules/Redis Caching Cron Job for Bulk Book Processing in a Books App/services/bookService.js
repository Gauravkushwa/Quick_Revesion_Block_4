/**
 * Business logic for book CRUD and bulk insertion.
 * Uses Redis for caching and bulk scheduling.
 */
const { v4: uuidv4 } = require("uuid");
const { readJSON, writeJSON } = require("../utils/fileDb");

const BOOKS_FILE = "./books.json";
const bulkUsersSetKey = "books:bulk:users";

// Helper: key generators
const cacheKey = (userId) => `books:cache:user:${userId}`;
const bulkListKey = (userId) => `books:bulk:user:${userId}`;

// ---------- CRUD ----------
async function getBooks(redis, userId) {
  const key = cacheKey(userId);
  const cached = await redis.get(key);
  if (cached) {
    console.log(`[Cache Hit] GET /books for ${userId}`);
    return JSON.parse(cached);
  }

  console.log(`[Cache Miss] GET /books for ${userId}`);
  const books = readJSON(BOOKS_FILE).filter((b) => b.userId === userId);
  await redis.set(key, JSON.stringify(books), { EX: 60 }); // TTL 60s
  return books;
}

async function addBook(redis, userId, { title, author }) {
  const books = readJSON(BOOKS_FILE);
  const book = { id: uuidv4(), userId, title, author, createdAt: Date.now() };
  books.push(book);
  writeJSON(BOOKS_FILE, books);
  await redis.del(cacheKey(userId)); // Invalidate cache
  return book;
}

async function updateBook(redis, userId, id, { title, author }) {
  const books = readJSON(BOOKS_FILE);
  const index = books.findIndex((b) => b.id === id && b.userId === userId);
  if (index === -1) throw new Error("Book not found");
  if (title) books[index].title = title;
  if (author) books[index].author = author;
  writeJSON(BOOKS_FILE, books);
  await redis.del(cacheKey(userId));
  return books[index];
}

async function deleteBook(redis, userId, id) {
  let books = readJSON(BOOKS_FILE);
  const original = books.length;
  books = books.filter((b) => !(b.id === id && b.userId === userId));
  if (books.length === original) throw new Error("Book not found");
  writeJSON(BOOKS_FILE, books);
  await redis.del(cacheKey(userId));
  return true;
}

// ---------- BULK ----------
async function queueBulkBooks(redis, userId, booksArray) {
  const listKey = bulkListKey(userId);
  await redis.rPush(listKey, JSON.stringify(booksArray));
  await redis.sAdd(bulkUsersSetKey, userId);
  console.log(`[Bulk Scheduled] ${booksArray.length} books for ${userId}`);
}

// ---------- CRON PROCESS ----------
async function insertBulkBooksFromRedis(redis) {
  const userIds = await redis.sMembers(bulkUsersSetKey);
  if (!userIds.length) {
    console.log("[Bulk Cron] No pending users");
    return;
  }

  for (const userId of userIds) {
    const listKey = bulkListKey(userId);
    const bulkItems = await redis.lRange(listKey, 0, -1);
    if (!bulkItems.length) continue;

    const booksDB = readJSON(BOOKS_FILE);
    let inserted = 0;

    for (const str of bulkItems) {
      const arr = JSON.parse(str);
      for (const item of arr) {
        if (!item.title) continue;
        booksDB.push({
          id: uuidv4(),
          userId,
          title: item.title,
          author: item.author || null,
          createdAt: Date.now(),
        });
        inserted++;
      }
    }

    writeJSON(BOOKS_FILE, booksDB);
    await redis.del(listKey);
    await redis.sRem(bulkUsersSetKey, userId);
    await redis.del(cacheKey(userId)); // invalidate cache
    console.log(`[Bulk Cron] Inserted ${inserted} books for ${userId}`);
  }
}

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  queueBulkBooks,
  insertBulkBooksFromRedis,
};

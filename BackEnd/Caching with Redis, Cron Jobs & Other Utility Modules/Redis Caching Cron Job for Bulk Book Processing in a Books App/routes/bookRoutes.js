/**
 * Routes for Book CRUD + Bulk API
 */
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getRedis } = require("../config/redis");
const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  queueBulkBooks,
  insertBulkBooksFromRedis,
} = require("../services/bookService");

// Protect all routes
router.use(auth);

// GET /api/books
router.get("/", async (req, res) => {
  const redis = getRedis();
  try {
    const books = await getBooks(redis, req.user.id);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/books
router.post("/", async (req, res) => {
  const redis = getRedis();
  try {
    const book = await addBook(redis, req.user.id, req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/books/:id
router.put("/:id", async (req, res) => {
  const redis = getRedis();
  try {
    const book = await updateBook(redis, req.user.id, req.params.id, req.body);
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/books/:id
router.delete("/:id", async (req, res) => {
  const redis = getRedis();
  try {
    await deleteBook(redis, req.user.id, req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/books/bulk → Schedule bulk insert
router.post("/bulk", async (req, res) => {
  const redis = getRedis();
  try {
    if (!Array.isArray(req.body))
      return res.status(400).json({ message: "Body must be an array" });
    await queueBulkBooks(redis, req.user.id, req.body);
    res.json({ message: "Books will be added later." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Manual cron trigger (optional for testing)
router.post("/_run-bulk-now", async (req, res) => {
  const redis = getRedis();
  await insertBulkBooksFromRedis(redis);
  res.json({ message: "Bulk processor run manually." });
});

module.exports = router;

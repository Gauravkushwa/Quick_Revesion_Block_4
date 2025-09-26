// middleware/library.middleware.js
const Library = require("../models/library.model");

// Generic validation for creating a book
async function validateAddBook(req, res, next) {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Incomplete Data", details: "title and author are required" });
  }
  // allow additional fields, but ensure we have the basics
  next();
}

// Validate borrow request - borrowerName required
async function validateBorrowRequest(req, res, next) {
  const { borrowerName } = req.body;
  if (!borrowerName || typeof borrowerName !== "string" || !borrowerName.trim()) {
    return res.status(400).json({ message: "Incomplete Data", details: "borrowerName is required to borrow a book" });
  }
  req.body.borrowerName = borrowerName.trim();
  next();
}

// Borrow limit middleware: a user cannot have more than 3 active borrowed books
async function enforceBorrowLimit(req, res, next) {
  try {
    const borrowerName = req.body.borrowerName;
    // Count documents in 'borrowed' state with this borrower
    const count = await Library.countDocuments({ borrowerName, status: "borrowed" });
    if (count >= 3) {
      return res.status(409).json({
        message: "Borrowing limit exceeded",
        details: `User "${borrowerName}" already has ${count} borrowed books. Limit is 3.`
      });
    }
    next();
  } catch (err) {
    console.error("Borrow limit check failed:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

// Middleware to prevent deleting a borrowed book
async function preventDeleteIfBorrowed(req, res, next) {
  const { id } = req.params;
  try {
    const book = await Library.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Not Found", details: "Book ID does not exist." });
    }
    if (book.status === "borrowed") {
      return res.status(409).json({ message: "Conflict", details: "Cannot delete a book that is currently borrowed." });
    }
    req.book = book; // attach for controller convenience
    next();
  } catch (err) {
    console.error("Delete check failed:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

module.exports = {
  validateAddBook,
  validateBorrowRequest,
  enforceBorrowLimit,
  preventDeleteIfBorrowed
};

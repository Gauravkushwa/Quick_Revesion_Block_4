// controllers/library.controller.js
const Library = require("../models/library.model");

/**
 * Utility: compute due date 14 days from borrowDate
 */
function computeDueDate(borrowDate) {
  const due = new Date(borrowDate);
  due.setDate(due.getDate() + 14);
  return due;
}

/**
 * Utility: compute overdue fee in rupees.
 * Rate: Rs. 10 per day (only whole days, partial day counts as full day).
 */
function computeOverdueFees(dueDate, returnDate) {
  if (!dueDate || !returnDate) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffMs = returnDate - dueDate;
  if (diffMs <= 0) return 0;
  const daysLate = Math.ceil(diffMs / msPerDay);
  return 10 * daysLate;
}

/**
 * POST /library/books
 * Add a new book
 */
async function addBook(req, res) {
  try {
    const { title, author } = req.body;
    // Set default status to "available" here (not in schema-level enums)
    const book = new Library({
      title,
      author,
      status: "available",
      borrowerName: null,
      borrowDate: null,
      dueDate: null,
      returnDate: null,
      overdueFees: 0
    });
    await book.save();
    return res.status(201).json({ message: "Book added successfully", data: book });
  } catch (err) {
    console.error("Add book error:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

/**
 * PATCH /library/borrow/:id
 * Borrow a book
 */
async function borrowBook(req, res) {
  try {
    const { id } = req.params;
    const borrowerName = req.body.borrowerName;

    // Find book
    const book = await Library.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Not Found", details: "Book ID does not exist." });
    }

    // Business rules: cannot borrow if already borrowed
    if (book.status === "borrowed") {
      return res.status(409).json({ message: "Conflict", details: "Book is already borrowed." });
    }

    // Optionally consider 'reserved' as not borrowable
    if (book.status === "reserved") {
      return res.status(409).json({ message: "Conflict", details: "Book is reserved and cannot be borrowed now." });
    }

    // perform borrow
    const now = new Date();
    book.status = "borrowed";
    book.borrowerName = borrowerName;
    book.borrowDate = now;
    book.dueDate = computeDueDate(now);
    book.returnDate = null; 

    await book.save();
    return res.status(200).json({
      message: "Book borrowed successfully",
      data: {
        id: book._id,
        title: book.title,
        borrowerName: book.borrowerName,
        borrowDate: book.borrowDate,
        dueDate: book.dueDate
      }
    });
  } catch (err) {
    console.error("Borrow error:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

/**
 * PATCH /library/return/:id
 * Return a book
 */
async function returnBook(req, res) {
  try {
    const { id } = req.params;
    const now = new Date();

    const book = await Library.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Not Found", details: "Book ID does not exist." });
    }

    if (book.status !== "borrowed") {
      return res.status(409).json({ message: "Conflict", details: "Book is not currently borrowed." });
    }

    const due = book.dueDate;
    const fee = computeOverdueFees(due, now);

    const previousFees = book.overdueFees || 0;
    const totalFees = previousFees + fee;

   
    book.returnDate = now;
    book.overdueFees = totalFees;

    // Mark as available and clear borrower-related fields (but keep returnDate & overdueFees for record)
    book.status = "available";
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;

    await book.save();

    return res.status(200).json({
      message: "Book returned successfully",
      data: {
        id: book._id,
        title: book.title,
        returnDate: book.returnDate,
        overdueFees: book.overdueFees,
        feeChargedThisReturn: fee
      }
    });
  } catch (err) {
    console.error("Return error:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

/**
 * GET /library/books
 * Retrieve books with optional filters: status, title
 */
async function getBooks(req, res) {
  try {
    const { status, title } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }
    if (title) {
      
      query.title = { $regex: title, $options: "i" };
    }

    const books = await Library.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ message: "Books retrieved", count: books.length, data: books });
  } catch (err) {
    console.error("Get books error:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

/**
 * DELETE /library/books/:id
 * Delete a book only if not borrowed
 */
async function deleteBook(req, res) {
  try {
    const { id } = req.params;

    let book = req.book;
    if (!book) {
      // fallback: find
      book = await Library.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Not Found", details: "Book ID does not exist." });
      }
      if (book.status === "borrowed") {
        return res.status(409).json({ message: "Conflict", details: "Cannot delete a book that is currently borrowed." });
      }
    }
    await Library.deleteOne({ _id: book._id });
    return res.status(200).json({ message: "Book deleted successfully", data: { id: book._id, title: book.title } });
  } catch (err) {
    console.error("Delete book error:", err);
    return res.status(500).json({ message: "Internal Server Error", details: err.message });
  }
}

module.exports = {
  addBook,
  borrowBook,
  returnBook,
  getBooks,
  deleteBook
};

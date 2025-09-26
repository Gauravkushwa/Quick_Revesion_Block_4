// routes/library.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../controllers/library.controller");
const middleware = require("../middleware/library.middleware");

// Add a book
router.post("/books",
  middleware.validateAddBook,
  controller.addBook
);

// Borrow a book
router.patch("/borrow/:id",
  middleware.validateBorrowRequest,
  middleware.enforceBorrowLimit,
  controller.borrowBook
);

router.patch("/return/:id",
  controller.returnBook
);


router.get("/books", controller.getBooks);

router.delete("/books/:id",
  middleware.preventDeleteIfBorrowed,
  controller.deleteBook
);

module.exports = router;


// Task 1: List of books borrowed by each borrower
db.loans.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $group: { _id: "$borrowerId", books: { $push: "$book.title" } } }
  ]);
  
  // Task 2: Top 3 most borrowed books
  db.loans.aggregate([
    { $group: { _id: "$bookId", borrowCount: { $sum: 1 } } },
    { $sort: { borrowCount: -1 } },
    { $limit: 3 },
    { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $project: { _id: 0, title: "$book.title", borrowCount: 1 } }
  ]);
  
  // Task 3: Borrower’s loan history with book details (User1)
  db.loans.aggregate([
    { $match: { borrowerId: "User1" } },
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $project: { _id: 0, bookTitle: "$book.title", loanDate: 1, returnDate: 1, status: 1 } }
  ]);
  
  // Task 4: Borrowers who have borrowed more than 2 books
  db.loans.aggregate([
    { $group: { _id: "$borrowerId", total: { $sum: 1 } } },
    { $match: { total: { $gt: 2 } } },
    { $lookup: { from: "borrowers", localField: "_id", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", total: 1 } }
  ]);
  
  // Task 5: Full report of all loans
  db.loans.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $lookup: { from: "borrowers", localField: "borrowerId", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", book: "$book.title", loanDate: 1, returnDate: 1, status: 1 } }
  ]);
  
  // Task 6: Genre-wise count of borrowed books
  db.loans.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $group: { _id: "$book.genre", totalBorrowed: { $sum: 1 } } }
  ]);
  
  // Task 7: Current borrowed books
  db.loans.aggregate([
    { $match: { status: "Borrowed" } },
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $lookup: { from: "borrowers", localField: "borrowerId", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", book: "$book.title" } }
  ]);
  
  // Task 8: Number of returned books per borrower
  db.loans.aggregate([
    { $match: { status: "Returned" } },
    { $group: { _id: "$borrowerId", returnedCount: { $sum: 1 } } },
    { $lookup: { from: "borrowers", localField: "_id", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", returnedCount: 1 } }
  ]);
  
  // Task 9: Borrowers who borrowed multiple genres
  db.loans.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $group: { _id: "$borrowerId", genres: { $addToSet: "$book.genre" } } },
    { $project: { genreCount: { $size: "$genres" }, genres: 1 } },
    { $match: { genreCount: { $gt: 1 } } },
    { $lookup: { from: "borrowers", localField: "_id", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", genres: 1 } }
  ]);
  
  // Task 10: List borrowers with total borrow count
  db.loans.aggregate([
    { $group: { _id: "$borrowerId", borrowCount: { $sum: 1 } } },
    { $lookup: { from: "borrowers", localField: "_id", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { _id: 0, borrower: "$borrower.name", borrowCount: 1 } }
  ]);
  
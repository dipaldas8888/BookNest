const express = require("express");

const {
  PostBook,
  getAllBooks,
  getSingleBook,
  updateBook,
  DeleteBook,
} = require("../controllers/BookController");

const router = express.Router();

router.post("/add-book", PostBook);
router.post("/get-books", getAllBooks);
router.post("/get-single-books", getSingleBook);
router.post("/update-books", updateBook);
router.post("/delete-book", DeleteBook);

module.exports = router;

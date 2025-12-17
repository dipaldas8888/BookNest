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
router.post("/:id", getSingleBook);
router.post("/update/:id", updateBook);
router.post("/delete/:id", DeleteBook);

module.exports = router;

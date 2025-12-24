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
router.get("/get-books", getAllBooks);
router.get("/:id", getSingleBook);
router.put("/update/:id", updateBook);
router.delete("/delete/:id", DeleteBook);

module.exports = router;

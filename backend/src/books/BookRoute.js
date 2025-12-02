const express = require("express");
const Book = require("./BookModel");

const { postBook, getAllBooks, getSingleBook } = require("./BookController");

const router = express.Router();

router.post("/create-book", postBook);

router.get("/get-books", getAllBooks);

router.get("/:id", getSingleBook);

module.exports = router;

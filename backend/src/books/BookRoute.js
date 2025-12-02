const express = require("express");
const Book = require("./BookModel");

const router = express.Router();

router.post("/create-books", async (req, res) => {
  try {
    const newBook = await Book({ ...req.body });
    await newBook.save();
    res.status(200).json({ message: "Book saved successfully", data: newBook });
  } catch (error) {
    console.log("caught some error", error);
    res.status(500).json({ error: "Unable to save Book" });
  }
});

module.exports = router;

const Book = require("../models/BookModel");
const cloudinary = require("../config/cloudinary");

// CREATE BOOK
const PostBook = async (req, res) => {
  try {
    const book = new Book({
      ...req.body,

      coverImage: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    await book.save();

    res.status(201).send({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("Error occurred", error);

    res.status(500).send({
      message: "Failed to create book",
    });
  }
};

// GET ALL BOOKS
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).send({
      message: "Books fetched successfully",
      books,
    });
  } catch (error) {
    console.log("Error occurred", error);

    res.status(500).send({
      message: "Unable to fetch books",
    });
  }
};

// GET SINGLE BOOK
const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({
        message: "Book not found",
      });
    }

    res.status(200).send({
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.log("Error occurred", error);

    res.status(500).send({
      message: "Error fetching book",
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({
        message: "Book not found",
      });
    }

    // If new image uploaded
    if (req.file) {
      // delete old image from cloudinary
      await cloudinary.uploader.destroy(book.coverImage.public_id);

      book.coverImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // update other fields
    book.title = req.body.title || book.title;
    book.description = req.body.description || book.description;
    book.category = req.body.category || book.category;
    book.price = req.body.price || book.price;
    book.trending = req.body.trending ?? book.trending;

    await book.save();

    res.status(200).send({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    console.log("Error occurred", error);

    res.status(500).send({
      message: "Failed to update book",
    });
  }
};

// DELETE BOOK
const DeleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({
        message: "Book not found",
      });
    }

    // delete image from cloudinary
    await cloudinary.uploader.destroy(book.coverImage.public_id);

    await Book.findByIdAndDelete(id);

    res.status(200).send({
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.log("Error occurred", error);

    res.status(500).send({
      message: "Unable to delete book",
    });
  }
};

module.exports = {
  PostBook,
  getAllBooks,
  updateBook,
  getSingleBook,
  DeleteBook,
};

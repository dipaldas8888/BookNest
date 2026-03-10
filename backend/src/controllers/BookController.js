const Book = require("../models/BookModel");
const cloudinary = require("../config/cloudinary");

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

const getAllBooks = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    const books = await Book.find(query).sort({ createdAt: -1 });

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

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).send({
        message: "Book not found",
      });
    }

    if (req.file) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);

      book.coverImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

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

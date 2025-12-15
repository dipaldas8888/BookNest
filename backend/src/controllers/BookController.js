const Book = require("../models/BookModel");

const PostBook = async (req, res) => {
  try {
    const book = await Book({ ...req.body });
    await book.save();
    res.status(200).send({
      message: "Book created Successfully",
      book: book,
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).send({
      message: "Failed to store Book",
    });
  }
};
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send({
      message: "All Books fetched",
      books: books,
    });
  } catch (error) {
    console.log("some error occured", error);
    res.status(500).send({
      message: "Unable to fetch Books",
    });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const Book = await Book.findById();
  } catch (error) {
    console.log("Some eror occured", error);
    res.status(500).send({
      message: "Error occured",
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedbook = await Book.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    if (!updatedbook) {
      return res.status(404).send({
        message: "Book not found",
      });
    }
    res.status(200).send({
      message: "Book updated Successfully",
      book: updatedbook,
    });
  } catch (error) {
    console.log("Some error occured", error);
    res.status(500).send({
      message: "Book not updated",
    });
  }
};
const DeleteBook = async (req, res) => {
  try {
    const deletedbook = await Book.findByIdAndDelete();
    if (!deletedbook) {
      res.status(404).send({
        message: "Book not found",
      });
    }
    res.status(200).send({
      message: "Book deleted Successfully",
      book: deletedbook,
    });
  } catch (error) {
    console.log("some error occured", error);
    res.status(500).send({
      message: "unable to delete book",
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

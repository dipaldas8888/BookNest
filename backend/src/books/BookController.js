const Book = require("./BookModel");

const postBook = async (req, res) => {
  try {
    const newBook = await Book({ ...req.body });
    await newBook.save();
    res.status(200).json({
      message: "Book saved Successfully",
      data: newBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to save Book" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({
      message: "Fetched all Books",
      data: books,
    });
  } catch (error) {
    console.log("Error in fetching Books", error);
    res.status(500).json({
      message: "Failed to fetch Books",
    });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({
        message: "Book not found",
      });
    }
  } catch (error) {
    console.log("Error Fetching Book", error);
    res.status(500).json({
      message: "Failed to fetch Book",
    });
  }
};
const UpdateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!book) {
      res.status(404).json({
        messsage: "Book not Found",
      });
    }
    res.status(200).json({
      message: "Book Updated Successfully",
      book: book,
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({
      message: "Failed to update a book",
    });
  }
};

const DeleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = Book.findByIdAndDelete(id);
    if (!book) {
      res.status(404).json({
        message: "Book not Found",
      });
    }
    res.ststus(200).json({
      message: "Book Deleted Successfully",
      Book: book,
    });
  } catch (error) {
    console.log("Error Occured", error);
    res.status(500).json({
      message: "Failed to delete a Book",
    });
  }
};

module.exports = {
  postBook,
  getAllBooks,
  getSingleBook,
};

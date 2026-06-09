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
    const {
      category,
      search,
      minPrice,
      maxPrice,
      trending,
      sortBy = "newest",
      page = 1,
      limit = 12,
    } = req.query;

    let query = {};

    // Category filter
    if (category && category !== "All") {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== "")
        query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== "")
        query.price.$lte = Number(maxPrice);
    }

    // Trending filter
    if (trending === "true") {
      query.trending = true;
    }

    // Sort options
    let sortOption = {};
    switch (sortBy) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "title_asc":
        sortOption = { title: 1 };
        break;
      case "title_desc":
        sortOption = { title: -1 };
        break;
      case "trending":
        sortOption = { trending: -1, createdAt: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [books, totalCount] = await Promise.all([
      Book.find(query).sort(sortOption).skip(skip).limit(limitNum),
      Book.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).send({
      message: "Books fetched successfully",
      books,
      pagination: {
        totalCount,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error occurred", error);
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

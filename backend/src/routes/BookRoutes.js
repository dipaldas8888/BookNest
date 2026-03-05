const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

const {
  PostBook,
  getAllBooks,
  updateBook,
  getSingleBook,
  DeleteBook,
} = require("../controllers/bookController");

// PUBLIC ROUTES
router.get("/", getAllBooks);
router.get("/:id", getSingleBook);

// ADMIN ROUTES
router.post("/create", verifyAdminToken, upload.single("coverImage"), PostBook);

router.put(
  "/update/:id",
  verifyAdminToken,
  upload.single("coverImage"),
  updateBook,
);

router.delete("/delete/:id", verifyAdminToken, DeleteBook);

module.exports = router;

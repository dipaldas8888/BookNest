const express = require("express");
const mongoose = require("mongoose");
const BookModel = require("./src/books/BookModel");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });

app.post("/add-book", async (req, res) => {
  try {
    const newBook = await BookModel.create({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
    });

    res.json({ message: "Book added successfully!", data: newBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log("Server running is  in 5000");
});

const express = require("express");
const mongoose = require("mongoose");
const BookModel = require("./src/books/BookModel");
require("dotenv").config();
const BookRoute = require("./src/books/BookRoute");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(
  cors({
    origin: ["https://localhost:5173"],
    credentials: true,
  })
);

app.use("/api/books", BookRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Connection failed", error);
  });

app.listen(port, () => {
  console.log("Server running is  in 5000");
});

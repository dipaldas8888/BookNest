const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const session = require("express-session");

require("dotenv").config();
const BookRoute = require("./src/routes/BookRoutes");
const OrderRoutes = require("./src/routes/OrderRoutes");
const AuthRoutes = require("./src/routes/AuthRoutes");
const passport = require("./src/config/passport");
const cors = require("cors");

const app = express();

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/books", BookRoute);
app.use("/", OrderRoutes);
app.use("/", AuthRoutes);

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

const express = require("express");
const passport = require("passport");

const {
  register,
  login,
  googleAuthSuccess,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthSuccess,
);

module.exports = router;

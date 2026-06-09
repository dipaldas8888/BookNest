const express = require("express");
const passport = require("passport");
const verifyToken = require("../middlewares/VerifyToken");
const upload = require("../middlewares/upload");

const {
  register,
  login,
  logout,
  getMe,
  googleAuthSuccess,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  updateProfile,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, getMe);

// OTP routes
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile setup route
router.put("/update-profile", verifyToken, upload.single("avatar"), updateProfile);

// Google OAuth routes
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

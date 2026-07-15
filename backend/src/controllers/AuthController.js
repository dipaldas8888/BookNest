const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/UserModel");
const cloudinary = require("../config/cloudinary");
const { generateOTP, sendOTPEmail } = require("../utils/otp");

// ─── In-memory store for pending (unverified) registrations ───────────────────
// Key: email (lowercase)
// Value: { name, email, hashedPassword, otp, otpExpiry }
// Users are only written to MongoDB AFTER they verify their OTP.
const pendingRegistrations = new Map();

// Auto-cleanup expired pending entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingRegistrations.entries()) {
    if (data.otpExpiry < now) {
      pendingRegistrations.delete(email);
    }
  }
}, 15 * 60 * 1000);

// ─── In-memory store for password reset OTPs ─────────────────────────────────
// Key: email, Value: { otp, otpExpiry }
const passwordResetOTPs = new Map();

// ─── Cookie options ───────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// ─── REGISTER ────────────────────────────────────────────────────────────────
// Step 1: Store details in memory + send OTP. No DB write yet.
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already a verified user in DB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // Hash password now so we never store plain text even in memory
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in pending map (overwrites if they re-register before verifying)
    pendingRegistrations.set(normalizedEmail, {
      name,
      email: normalizedEmail,
      hashedPassword,
      otp,
      otpExpiry,
    });

    // Send OTP — if this fails, we don't save anything
    try {
      await sendOTPEmail(normalizedEmail, otp, "verification");
    } catch (mailErr) {
      pendingRegistrations.delete(normalizedEmail);
      console.error("Failed to send OTP email:", mailErr.message);
      return res.status(500).json({
        message: "Failed to send verification email. Please check your email address and try again.",
      });
    }

    return res.status(200).json({
      message: "Verification code sent to your email. Please check your inbox.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

// ─── VERIFY OTP (Registration) ───────────────────────────────────────────────
// Step 2: Verify OTP → create user in DB → issue token
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const pending = pendingRegistrations.get(normalizedEmail);

    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found for this email. Please register again.",
      });
    }

    if (pending.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (pending.otpExpiry < Date.now()) {
      pendingRegistrations.delete(normalizedEmail);
      return res.status(400).json({
        message: "Verification code has expired. Please register again.",
      });
    }

    // ✅ OTP is valid — create user in DB now
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.hashedPassword,
    });

    // Password is already hashed — skip pre-save hook
    user.$locals = { skipPasswordHash: true };
    await user.save();

    // Clear from pending store
    pendingRegistrations.delete(normalizedEmail);

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "Account created and verified successfully!",
      token,
      User: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Verification failed. Please try again." });
  }
};

// ─── RESEND OTP ──────────────────────────────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const pending = pendingRegistrations.get(normalizedEmail);
    if (!pending) {
      return res.status(400).json({
        message: "No pending registration found. Please register again.",
      });
    }

    const newOtp = generateOTP();
    pending.otp = newOtp;
    pending.otpExpiry = Date.now() + 10 * 60 * 1000;
    pendingRegistrations.set(normalizedEmail, pending);

    try {
      await sendOTPEmail(normalizedEmail, newOtp, "verification");
    } catch (mailErr) {
      console.error("Failed to resend OTP:", mailErr.message);
      return res.status(500).json({ message: "Failed to send email. Please try again." });
    }

    return res.status(200).json({
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Failed to resend code." });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin bypass
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let admin = await User.findOne({ email });
      if (!admin) {
        admin = new User({ name: "Admin", email, password, role: "admin" });
        await admin.save();
      }
      const token = generateToken(admin);
      res.cookie("token", token, cookieOptions);
      return res.status(200).json({
        message: "Admin login successful",
        token,
        User: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      token,
      User: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        shippingAddress: user.shippingAddress,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address." });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 10 * 60 * 1000;
    passwordResetOTPs.set(normalizedEmail, { otp, otpExpiry });

    try {
      await sendOTPEmail(normalizedEmail, otp, "reset");
    } catch (mailErr) {
      passwordResetOTPs.delete(normalizedEmail);
      console.error("Failed to send reset email:", mailErr.message);
      return res.status(500).json({ message: "Failed to send reset email. Please try again." });
    }

    return res.status(200).json({
      message: "Password reset code sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Failed to initiate password reset." });
  }
};

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const resetData = passwordResetOTPs.get(normalizedEmail);
    if (!resetData) {
      return res.status(400).json({ message: "No password reset was requested for this email." });
    }

    if (resetData.otp !== String(otp)) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (resetData.otpExpiry < Date.now()) {
      passwordResetOTPs.delete(normalizedEmail);
      return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    passwordResetOTPs.delete(normalizedEmail);

    return res.status(200).json({ message: "Password reset successful. You can now sign in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Password reset failed. Please try again." });
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) user.password = req.body.password;

    if (req.file) {
      if (user.avatar?.public_id) {
        try { await cloudinary.uploader.destroy(user.avatar.public_id); } catch (_) {}
      }
      user.avatar = { url: req.file.path, public_id: req.file.filename };
    }

    if (req.body.shippingAddress) {
      let addr = req.body.shippingAddress;
      if (typeof addr === "string") {
        try { addr = JSON.parse(addr); } catch (_) {}
      }
      user.shippingAddress = {
        address: addr.address ?? user.shippingAddress.address,
        city: addr.city ?? user.shippingAddress.city,
        state: addr.state ?? user.shippingAddress.state,
        zipCode: addr.zipCode ?? user.shippingAddress.zipCode,
        country: addr.country ?? user.shippingAddress.country,
      };
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");

    return res.status(200).json({ message: "Profile updated successfully", User: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Failed to update profile." });
  }
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully." });
};

// ─── GET ME ──────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    return res.status(200).json({ User: user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user." });
  }
};

// ─── GOOGLE AUTH ─────────────────────────────────────────────────────────────
const googleAuthSuccess = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.cookie("token", token, cookieOptions);
    const frontendUrl = (req.query.state || process.env.FRONTEND_URL || "https://book-nest-omega.vercel.app").replace(/\/$/, "");
    res.redirect(`${frontendUrl}/oauth-success?token=${token}`);
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Google authentication failed." });
  }
};

module.exports = {
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
};

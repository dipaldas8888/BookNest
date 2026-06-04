const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).send({
        message: "Email already in use",
      });
    }
    const user = new User({
      name,
      email,
      password,
    });
    await user.save();

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    res.status(201).send({
      message: "User Registered successfully",
      token,
      User: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Failed to register User",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      let admin = await User.findOne({ email });
      if (!admin) {
        admin = new User({
          name: "Admin",
          email,
          password,
          role: "admin",
        });
        await admin.save();
      }
      const token = generateToken(admin);
      res.cookie("token", token, cookieOptions);

      return res.status(200).send({
        message: "Admin login Successfully",
        token,
        User: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }

    const token = generateToken(user);
    res.cookie("token", token, cookieOptions);

    res.status(200).send({
      message: "Login Successful",
      token,
      User: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ message: "Failed to login" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.status(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).send({ message: "Failed to logout" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ User: user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).send({ message: "Server error fetching user details" });
  }
};

const googleAuthSuccess = async (req, res) => {
  try {
    const token = generateToken(req.user);
    res.cookie("token", token, cookieOptions);

    res.redirect(`http://localhost:5173/oauth-success`);
  } catch (error) {
    console.error("Google authentication callback error:", error);
    res.status(500).send({
      message: "Google authentication failed",
    });
  }
};

module.exports = { register, login, logout, getMe, googleAuthSuccess };

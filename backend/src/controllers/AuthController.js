const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiration: "7d",
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
      role,
    });
    await user.save();
    res.status(201).send({
      messsage: "User Registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("Error registering user", error);
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

      return res.status(200).send({
        message: "Admin login Successfully",
        token,
        role: "admin",
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
    console.log("Error logging in", error);
    res.status(500).send({ message: "Failed to login" });
  }
};
module.exports = { register, login };

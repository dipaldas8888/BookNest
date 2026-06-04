const User = require("../models/UserModel");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role value. Must be 'user' or 'admin'",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Optional: Prevent admin from de-escalating themselves
    if (user._id.toString() === req.user.id && role !== "admin") {
      return res.status(400).json({
        message: "You cannot change your own admin role",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      message: "Failed to update user role",
    });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Optional: Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        message: "You cannot delete your own admin account",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};

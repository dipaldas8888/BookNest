const express = require("express");
const router = express.Router();
const verifyAdminToken = require("../middlewares/VerifyAdminToken");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/UserController");

router.get("/", verifyAdminToken, getAllUsers);
router.put("/:id/role", verifyAdminToken, updateUserRole);
router.delete("/:id", verifyAdminToken, deleteUser);

module.exports = router;

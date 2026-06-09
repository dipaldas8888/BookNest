const express = require("express");

const {
  createOrder,
  getAllOrders,
  getMyOrders,
  deleteOrder,
} = require("../controllers/OrderController");

const VerifyToken = require("../middlewares/VerifyToken");
const VerifyAdminToken = require("../middlewares/VerifyAdminToken");

const router = express.Router();

router.get("/all-orders", VerifyAdminToken, getAllOrders);
router.post("/order", VerifyToken, createOrder);
router.get("/my-orders", VerifyToken, getMyOrders);
router.delete("/order/:id", VerifyAdminToken, deleteOrder);

module.exports = router;

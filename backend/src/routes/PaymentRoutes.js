const express = require("express");
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require("../controllers/PaymentController");
const verifyToken = require("../middlewares/VerifyToken");

// Create a Razorpay order (authenticated users only)
router.post("/api/payment/create-order", verifyToken, createPaymentOrder);

// Verify payment signature after Razorpay checkout
router.post("/api/payment/verify", verifyToken, verifyPayment);

module.exports = router;

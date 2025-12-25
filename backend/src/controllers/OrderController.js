const Order = require("../models/OrderModel");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, totalAmount } = req.body;

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      status: "completed",
    });

    res.status(201).send({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log("Error occurred", error);
    res.status(500).send({ message: "Failed to create order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("items.book", "title newPrice coverImage")
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error fetching orders", error);
    res.status(500).send({ message: "Failed to fetch orders" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate("items.book", "title newPrice coverImage")
      .sort({ createdAt: -1 });

    res.status(200).send({
      message: "My orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders", error);
    res.status(500).send({ message: "Failed to fetch orders" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
};

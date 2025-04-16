const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract user ID from the authenticated request

  const orders = await Order.find({ user: userId }).populate("items.product");

  res.status(200).json({ orders });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("items.product", "title price")
    .populate("items.seller", "name email");
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title price")
    .populate("items.seller", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  res.status(200).json(order);
});

const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items provided in order");
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    totalAmount,
  });

  res.status(201).json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (status && ["Pending", "Cancelled", "Completed"].includes(status)) {
    order.overallStatus = status;
    await order.save();
    res.status(200).json(order);
  } else {
    res.status(400);
    throw new Error("Invalid status");
  }
});

const updateItemStatus = asyncHandler(async (req, res) => {
  const { itemId, itemStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const item = order.items.id(itemId);
  if (!item) {
    res.status(404);
    throw new Error("Item not found in order");
  }

  if (["Pending", "Cancelled", "Completed"].includes(itemStatus)) {
    item.itemStatus = itemStatus;
    await order.save();
    res.status(200).json(order);
  } else {
    res.status(400);
    throw new Error("Invalid item status");
  }
});

module.exports = {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateItemStatus,
};

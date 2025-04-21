const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Get all orders by logged-in user
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).populate("items.product");
  res.status(200).json({ orders });
});

// Admin or seller: get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("items.product", "title price")
    .populate("items.seller", "name email");
  res.status(200).json(orders);
});

// Get order by ID
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
  const userId = req.user._id;
  const { shippingAddress, additionalNotes } = req.body;

  const user = await User.findById(userId).populate("cart.product");

  if (!user || !user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];

  for (const item of user.cart) {
    const product = item.product;

    if (!product || !product.isAvailable) {
      res.status(400);
      throw new Error(`Product not available: ${item.product?._id}`);
    }

    product.isAvailable = false;
    await product.save();

    orderItems.push({
      product: product._id,
      seller: product.seller,
      itemStatus: "Pending",
    });
  }

  const totalAmount = orderItems.reduce((acc, item) => {
    const product = user.cart.find((c) =>
      c.product._id.equals(item.product)
    ).product;
    return acc + product.price;
  }, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    contactName: user.name,
    contactEmail: user.email,
    contactPhone: user.phone,
    additionalNotes,
  });

  // 🧹 Clear cart
  user.cart = [];
  await user.save();

  res.status(201).json(order);
});

// Manually update overall order status (Admin/Seller control)
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

  if (!["Pending", "Cancelled", "Completed"].includes(itemStatus)) {
    res.status(400);
    throw new Error("Invalid item status");
  }

  // If item is moving to "Completed" from another status
  const isBecomingCompleted =
    item.itemStatus !== "Completed" && itemStatus === "Completed";

  item.itemStatus = itemStatus;

  // 💰 Update seller's earnings
  if (isBecomingCompleted) {
    const product = await Product.findById(item.product);
    const seller = await User.findById(item.seller);

    if (seller && product) {
      seller.sellerDetails.earnings += product.price;
      await seller.save();
    }
  }

  // Update overall order status if all items are fulfilled
  const allDone = order.items.every((i) => i.itemStatus === "Completed");
  if (allDone) {
    order.overallStatus = "Completed";
  }

  await order.save();
  res.status(200).json(order);
});

module.exports = {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateItemStatus,
};

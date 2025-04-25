const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).populate("items.product");
  res.status(200).json({ orders });
});
const getSellerOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const orders = await Order.find({ "items.seller": sellerId })
    .populate("user", "name email")
    .populate("items.product", "title price")
    .populate("items.seller", "name email");

  const sellerOrders = orders.map((order) => {
    const sellerItems = order.items.filter((item) =>
      item.seller.equals(sellerId)
    );

    return {
      _id: order._id,
      user: order.user,
      shippingAddress: order.shippingAddress,
      contactName: order.contactName,
      contactEmail: order.contactEmail,
      contactPhone: order.contactPhone,
      additionalNotes: order.additionalNotes,
      totalAmount: sellerItems.reduce(
        (sum, item) => sum + item.product.price,
        0
      ),
      items: sellerItems,
      overallStatus: order.overallStatus,
      createdAt: order.createdAt,
    };
  });

  res.status(200).json(sellerOrders);
});

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

  console.log("[createOrder] userId:", userId);
  console.log("[createOrder] shippingAddress:", shippingAddress);
  console.log("[createOrder] additionalNotes:", additionalNotes);

  const user = await User.findById(userId).populate("cart.product");
  console.log("[createOrder] user:", user);

  if (!user || !user.cart || user.cart.length === 0) {
    console.error("[createOrder] Cart is empty or user not found");
    res.status(400);
    throw new Error("Your cart is empty");
  }

  const orderItems = [];

  for (const item of user.cart) {
    const product = item.product;
    console.log("[createOrder] Checking product:", product);

    if (!product || !product.isAvailable) {
      console.error("[createOrder] Product not available:", product?._id);
      res.status(400);
      throw new Error(`Product not available: ${item.product?._id}`);
    }

    product.isAvailable = false;
    await product.save();
    console.log("[createOrder] Marked product as unavailable:", product._id);

    orderItems.push({
      product: product._id,
      itemStatus: "Pending",
    });
  }

  console.log("[createOrder] orderItems:", orderItems);

  const totalAmount = orderItems.reduce((acc, item) => {
    const product = user.cart.find((c) =>
      c.product._id.equals(item.product)
    ).product;
    return acc + product.price;
  }, 0);

  console.log("[createOrder] totalAmount:", totalAmount);

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

  console.log("[createOrder] Created order:", order);

  // 🧹 Clear cart
  user.cart = [];
  await user.save();
  console.log("[createOrder] Cleared user cart");

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
  getSellerOrders,
};

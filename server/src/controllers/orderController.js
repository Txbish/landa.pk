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
  const {
    shippingAddress,
    additionalNotes,
    contactName,
    contactEmail,
    contactPhone,
  } = req.body;

  const user = await User.findById(userId).populate("cart.product");

  if (user.role === "admin") {
    res.status(403);
    throw new Error("Admins cannot place orders");
  }

  console.log("[createOrder] userId:", userId);
  console.log("[createOrder] shippingAddress:", shippingAddress);
  console.log("[createOrder] additionalNotes:", additionalNotes);

  console.log("[createOrder] user:", user);

  if (!user || !user.cart || user.cart.length === 0) {
    console.error("[createOrder] Cart is empty or user not found");
    res.status(400);
    throw new Error("Your cart is empty");
  }
  if (user.role === "seller") {
    const ownsProduct = user.cart.some(
      (item) =>
        item.product &&
        item.product.seller &&
        item.product.seller.toString() === user._id.toString()
    );
    if (ownsProduct) {
      res.status(403);
      throw new Error("Sellers cannot buy their own products");
    }
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
      seller: product.seller,
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
    contactName: contactName,
    contactEmail: contactEmail,
    contactPhone: contactPhone,
    additionalNotes,
  });

  console.log("[createOrder] Created order:", order);

  user.cart = [];
  await user.save();
  console.log("[createOrder] Cleared user cart");

  res.status(201).json(order);
});

const recalculateOrderTotal = async (order) => {
  let total = 0;

  for (const item of order.items) {
    if (item.itemStatus !== "Cancelled") {
      const product = await Product.findById(item.product);
      if (product) {
        total += product.price;
      }
    }
  }

  order.totalAmount = total;
  return order;
};

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if the status provided is valid
  if (status && ["Pending", "Cancelled", "Completed"].includes(status)) {
    let partialCompleted = false;

    // Handle Completed status logic
    if (status === "Completed") {
      // Update all Pending items to Completed and leave Cancelled items as is
      await Promise.all(
        order.items.map((item) => {
          if (item.itemStatus === "Pending") {
            return updateItemStatus(
              {
                params: { id: req.params.id }, // Keep the order ID
                body: { itemId: item._id, itemStatus: "Completed" }, // Pass item ID and new status
              },
              res
            ); // Pass response object
          }
        })
      );

      const allItemsCompleted = order.items.every(
        (item) => item.itemStatus === "Completed"
      );

      // If all items are completed, set the order as completed
      if (allItemsCompleted) {
        order.overallStatus = "Completed";
      } else {
        // If some are completed and others are still pending, set it as partial completed
        partialCompleted = order.items.some(
          (item) => item.itemStatus === "Completed"
        );
        if (partialCompleted) {
          order.overallStatus = "Partial Completed";
        } else {
          res.status(400);
          throw new Error(
            "Cannot mark order as Completed because not all items are completed"
          );
        }
      }
    }

    // Handle Cancelled status logic
    if (status === "Cancelled") {
      // Update all Pending items to Cancelled and leave Completed items as is
      await Promise.all(
        order.items.map((item) => {
          if (item.itemStatus === "Pending") {
            return updateItemStatus(
              {
                params: { id: req.params.id }, // Keep the order ID
                body: { itemId: item._id, itemStatus: "Cancelled" }, // Pass item ID and new status
              },
              res
            ); // Pass response object
          }
        })
      );

      const allItemsCancelled = order.items.every(
        (item) => item.itemStatus === "Cancelled"
      );

      const anyCancelled = order.items.some(
        (item) => item.itemStatus === "Cancelled"
      );

      // If all items are cancelled, set the order as cancelled
      if (allItemsCancelled) {
        order.overallStatus = "Cancelled";
      } else if (anyCancelled) {
        // If some items are cancelled, but not all, set the order as partially cancelled
        order.overallStatus = "Partial Cancelled";
      }
    }

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

  if (item.itemStatus !== "Pending") {
    res.status(400);
    throw new Error(
      "Cannot update an item that is already Cancelled or Completed"
    );
  }

  const isBecomingCompleted = itemStatus === "Completed";
  const isBecomingCancelled = itemStatus === "Cancelled";

  item.itemStatus = itemStatus;

  if (isBecomingCompleted) {
    const product = await Product.findById(item.product);
    const seller = await User.findById(item.seller);

    if (seller && product) {
      seller.sellerDetails.earnings += product.price;
      await seller.save();
    }
  }

  // Mark product available again if item is cancelled
  if (isBecomingCancelled) {
    const product = await Product.findById(item.product);
    if (product) {
      product.isAvailable = true;
      await product.save();
    }
  }

  // ✅ Update overall order status
  const allFinal = order.items.every((i) => i.itemStatus !== "Pending");
  const anyCompleted = order.items.some((i) => i.itemStatus === "Completed");
  const anyCancelled = order.items.some((i) => i.itemStatus === "Cancelled");

  if (allFinal) {
    if (anyCompleted && !anyCancelled) {
      order.overallStatus = "Completed";
    } else if (!anyCompleted && anyCancelled) {
      order.overallStatus = "Cancelled";
    } else if (anyCompleted && anyCancelled) {
      order.overallStatus = "Partial Completed";
    }
  } else {
    if (anyCompleted) {
      order.overallStatus = "Partial Completed";
    } else if (anyCancelled) {
      order.overallStatus = "Partial Cancelled";
    } else {
      order.overallStatus = "Pending"; // If some items are still pending
    }
  }

  await recalculateOrderTotal(order);
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

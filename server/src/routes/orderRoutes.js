const express = require("express");
const router = express.Router();
const { authenticate, admin } = require("../middleware/auth");
const {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateItemStatus,
} = require("../controllers/orderController");

router.get("/", authenticate, admin, getAllOrders);

router.post("/", authenticate, createOrder);

router.get("/userOrder", authenticate, getUserOrders);

router.get("/:id", authenticate, getOrderById);

router.put("/:id", authenticate, updateOrderStatus);

router.put("/:id/item", authenticate, updateItemStatus);

module.exports = router;

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
  getSellerOrders,
} = require("../controllers/orderController");

router.get("/userOrder", authenticate, getUserOrders);
router.get("/sellerOrder", authenticate, getSellerOrders);

router.put("/:id/item", authenticate, updateItemStatus);

router.get("/", authenticate, admin, getAllOrders);
router.post("/", authenticate, createOrder);
router.get("/:id", authenticate, getOrderById);
router.put("/:id", authenticate, updateOrderStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth");
const {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticate, isAdmin, getAllOrders)
  .post(authenticate, createOrder);

router
  .route("/:id")
  .get(authenticate, getOrderById)
  .put(authenticate, updateOrderStatus);

router.get("/userOrder", authenticate, getUserOrders);

module.exports = router;

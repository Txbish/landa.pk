const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.route("/").get(protect, getAllOrders).post(authenticate, createOrder);

router
  .route("/:id")
  .get(protect, getOrderById)
  .put(authenticate, updateOrderStatus);

module.exports = router;

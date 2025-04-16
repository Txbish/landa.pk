const express = require("express");
const router = express.Router();
const { authenticate, admin } = require("../middleware/auth");
const {
  getUserOrders,
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticate, admin, getAllOrders)
  .post(authenticate, createOrder);

router
  .route("/:id")
  .get(authenticate, getOrderById)
  .put(authenticate, updateOrderStatus);

router.route("/userOrder").get(authenticate, getUserOrders);

module.exports = router;

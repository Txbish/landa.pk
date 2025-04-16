// routes/sellerRequestRoutes.js
const express = require("express");
const {
  getUserSellerRequest,
  createSellerRequest,
  getSellerRequests,
  handleSellerRequest,
} = require("../controllers/sellerRequestController");
const { authenticate, admin } = require("../middleware/auth");

const router = express.Router();
router.get("/", authenticate, getUserSellerRequest);
router.post("/", authenticate, createSellerRequest);
router.get("/All", authenticate, admin, getSellerRequests);
router.put("/:id", authenticate, admin, handleSellerRequest);

module.exports = router;

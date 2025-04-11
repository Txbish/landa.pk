// routes/sellerRequestRoutes.js
const express = require("express");
const {
  createSellerRequest,
  getSellerRequests,
  handleSellerRequest,
} = require("../controllers/sellerRequestController");
const { authenticate, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, createSellerRequest);
router.get("/", authenticate, admin, getSellerRequests);
router.put("/:id", authenticate, admin, handleSellerRequest);

module.exports = router;

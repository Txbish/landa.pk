const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { authenticate } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", getCart);
router.post("/", addToCart);
router.delete("/", clearCart);
router.delete("/:productId", removeFromCart);

module.exports = router;

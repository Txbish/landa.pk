const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getProducts,
  getProductById, // <-- Add this line
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(authenticate, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);

module.exports = router;

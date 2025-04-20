const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../controllers/productController");

router.route("/").get(getProducts).post(authenticate, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);
router.get("/:id/related", getRelatedProducts);
module.exports = router;

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.route("/").get(getAllProducts).post(authenticate, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, updateProduct)
  .delete(authenticate, deleteProduct);

module.exports = router;

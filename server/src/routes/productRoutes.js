const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} = require("../controllers/productController");

router
  .route("/")
  .get(getProducts)
  .post(authenticate, upload.single("image"), createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(authenticate, upload.single("image"), updateProduct)
  .delete(authenticate, deleteProduct);

router.get("/:id/related", getRelatedProducts);

module.exports = router;

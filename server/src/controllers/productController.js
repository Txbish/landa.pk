const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("seller", "name email"); // Optional: populate seller info
  res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "seller",
    "name email"
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, image, quantity, isAvailable } =
    req.body;

  if (!title || !price || !image) {
    res.status(400);
    throw new Error("Title, price, and image are required");
  }

  const product = await Product.create({
    title,
    description,
    price,
    category,
    image,
    quantity,
    isAvailable,
    seller: req.user._id,
  });

  res.status(201).json(product);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updates = req.body;
  Object.assign(product, updates);

  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product removed" });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

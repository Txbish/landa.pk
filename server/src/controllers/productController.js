const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, order, search, limit, page } =
    req.query;

  const query = {};
  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (search) query.title = { $regex: search, $options: "i" };

  const sort = {};
  if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

  let productsQuery = Product.find(query)
    .sort(sort)
    .populate("seller", "name email");

  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  productsQuery = productsQuery
    .skip((currentPage - 1) * itemsPerPage)
    .limit(itemsPerPage);

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const products = await productsQuery;

  res.status(200).json({
    products,
    currentPage,
    totalPages,
    totalProducts,
  });
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

const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }
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

const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const limit = parseInt(req.query.limit) || 4;

  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(limit)
    .populate("seller", "name email");

  res.status(200).json(relatedProducts);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
};

const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, order, search, limit } =
    req.query;

  const query = {};
  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (search) query.title = { $regex: search, $options: "i" }; // Case-insensitive search

  const sort = {};
  if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

  let productsQuery = Product.find(query)
    .sort(sort)
    .populate("seller", "name email");

  if (limit) {
    productsQuery = productsQuery.limit(Number(limit));
  }

  res.status(200).json(products);
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
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

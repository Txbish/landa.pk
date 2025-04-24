const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function formatProduct(product) {
  if (!product) return null;
  return {
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    isAvailable: product.isAvailable,
    seller: product.seller,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, order, search, limit, page } =
    req.query;

  const query = { isAvailable: true }; // Only available products
  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (search) query.title = { $regex: search, $options: "i" };

  const sort = {};
  if (sortBy) sort[sortBy] = order === "desc" ? -1 : 1;

  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  const productsQuery = Product.find(query)
    .sort(sort)
    .skip((currentPage - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .populate("seller", "name email createdAt")
    .lean();

  const [products, totalProducts] = await Promise.all([
    productsQuery,
    Product.countDocuments(query),
  ]);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  res.status(200).json({
    products: products.map(formatProduct),
    currentPage,
    totalPages,
    totalProducts,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, category, isAvailable, image } = req.body;
  let imageUrl = image;

  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });
    imageUrl = uploadResult.secure_url;
  }

  if (!title || !price || !imageUrl) {
    res.status(400);
    throw new Error("Title, price, and image are required");
  }

  const product = await Product.create({
    title,
    description,
    price,
    category,
    image: imageUrl,
    isAvailable,
    seller: req.user._id,
  });

  await product.populate("seller", "name email createdAt");
  res.status(201).json(formatProduct(product));
});

const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedFields = req.body;

  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });
    updatedFields.image = uploadResult.secure_url;
  }

  Object.assign(product, updatedFields);
  await product.save();
  await product.populate("seller", "name email createdAt");
  res.status(200).json(formatProduct(product));
});

const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.status(200).json({ message: "Product removed" });
});

// Get a product by ID
const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }
  const product = await Product.findById(req.params.id)
    .populate("seller", "name email createdAt")
    .lean();
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json(formatProduct(product));
});

const getRelatedProducts = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid product ID");
  }
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const limit = parseInt(req.query.limit) || 4;
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    isAvailable: true,
  })
    .limit(limit)
    .populate("seller", "name email createdAt")
    .lean();

  res.status(200).json(relatedProducts.map(formatProduct));
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
};

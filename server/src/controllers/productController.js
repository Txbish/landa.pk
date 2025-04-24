const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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
    isDeleted: product.isDeleted,
    seller: product.seller,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function extractPublicIdFromUrl(url) {
  const parts = url.split("/");
  const fileName = parts.pop().split(".")[0];
  const folder =
    parts[parts.length - 1] === "products"
      ? "products"
      : parts[parts.length - 2];
  return `${folder}/${fileName}`;
}

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
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
  const { title, description, price, category, isAvailable } = req.body;
  let imageUrl;

  if (req.file) {
    try {
      console.log("Uploaded file info:", req.file);

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploadResult.secure_url;
    } catch (err) {
      console.error("Cloudinary Upload Error:", err.message, err);
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  if (!title || !price || !imageUrl) {
    console.error("Missing fields:", { title, price, imageUrl });
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

const getSellerProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const { includeDeleted, limit, page } = req.query;

  const query = {
    seller: sellerId,
    isAvailable: true,
    isDeleted: { $ne: true },
  };

  if (includeDeleted !== "true") {
    query.isDeleted = { $ne: true };
  } else {
    query.isDeleted = true;
  }

  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;

  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 })
      .populate("seller", "name email createdAt")
      .lean(),
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

  const previousImage = product.image;

  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file.buffer);
    updatedFields.image = uploadResult.secure_url;

    if (previousImage) {
      const publicId = extractPublicIdFromUrl(previousImage);
      await cloudinary.uploader.destroy(publicId);
    }
  }

  if (updatedFields.image === "") {
    updatedFields.image = null;

    if (previousImage) {
      const publicId = extractPublicIdFromUrl(previousImage);
      await cloudinary.uploader.destroy(publicId);
    }
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

  product.isDeleted = true;
  product.isAvailable = false;

  await product.save();

  res.status(200).json({ message: "Product soft-deleted" });
});

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
  getSellerProducts,
};

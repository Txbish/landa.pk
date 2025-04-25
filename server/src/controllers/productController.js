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
  console.log("req.user:", req.user);
  const sellerId = req.user?._id;
  if (!sellerId) {
    console.error("Seller ID is missing in req.user");
    res.status(400).json({ message: "Seller ID is required" });
    return;
  }

  const { includeDeleted, limit, page, search, sortBy, order } = req.query;
  console.log("req.query:", req.query);

  const query = { seller: sellerId };

  if (includeDeleted === "true") {
    query.isDeleted = true;
  } else {
    query.isDeleted = { $ne: true };
    query.isAvailable = true;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  console.log("Constructed query:", query);

  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const skip = (currentPage - 1) * itemsPerPage;

  const sortOptions = {};
  if (sortBy && order) {
    sortOptions[sortBy] = order === "asc" ? 1 : -1;
  }
  sortOptions.createdAt = -1;

  try {
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .skip(skip)
        .limit(itemsPerPage)
        .sort(sortOptions)
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
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  console.log("Update product request received. Params:", req.params);
  console.log("Request body:", req.body);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    console.error("Invalid product ID:", req.params.id);
    res.status(400);
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    console.error("Product not found for ID:", req.params.id);
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedFields = req.body;
  console.log("Updated fields before processing image:", updatedFields);

  const previousImage = product.image;
  console.log("Previous image URL:", previousImage);

  if (req.file) {
    try {
      console.log("File uploaded. Processing Cloudinary upload...");
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      updatedFields.image = uploadResult.secure_url;
      console.log(
        "New image uploaded to Cloudinary. URL:",
        updatedFields.image
      );

      if (previousImage) {
        const publicId = extractPublicIdFromUrl(previousImage);
        console.log(
          "Deleting previous image from Cloudinary. Public ID:",
          publicId
        );
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("Error uploading new image to Cloudinary:", error);
      res.status(500);
      throw new Error("Failed to upload image to Cloudinary");
    }
  } else if (!updatedFields.image || updatedFields.image === "") {
    console.log("Image field is empty. Removing image...");
    updatedFields.image = null;

    if (previousImage) {
      const publicId = extractPublicIdFromUrl(previousImage);
      console.log(
        "Deleting previous image from Cloudinary. Public ID:",
        publicId
      );
      await cloudinary.uploader.destroy(publicId);
    }
  } else {
    console.log("No new image provided. Keeping existing image.");
    delete updatedFields.image;
  }

  console.log("Final updated fields:", updatedFields);

  Object.assign(product, updatedFields);
  await product.save();
  console.log("Product updated successfully. ID:", product._id);

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

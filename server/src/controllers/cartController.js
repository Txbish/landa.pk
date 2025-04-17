const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Filter out unavailable or deleted products
  const cleanedCart = user.cart.filter(
    (item) => item.product && item.product.isAvailable
  );

  user.cart = cleanedCart.map((item) => ({
    product: item.product._id,
    addedAt: item.addedAt,
  }));

  await user.save();

  res.status(200).json({ cart: cleanedCart });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);
  const product = await Product.findById(productId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!product || !product.isAvailable) {
    res.status(400);
    throw new Error("Product not available or doesn't exist");
  }

  const alreadyInCart = user.cart.some(
    (p) => p.product.toString() === productId
  );
  if (alreadyInCart) {
    res.status(400);
    throw new Error("Product already in cart");
  }

  user.cart.push({ product: productId });
  await user.save();

  res.status(200).json({ message: "Added to cart" });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cart = user.cart.filter((p) => p.product.toString() !== productId);
  await user.save();

  res.status(200).json({ message: "Removed from cart" });
});

const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.cart = [];
  await user.save();

  res.status(200).json({ message: "Cart cleared" });
});

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

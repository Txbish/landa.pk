const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  if (!name || !email || !password || !address || !phone) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    address,
    phone,
  });

  if (user) {
    res.status(201).json({
      messaege: "User registered successfully",
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 3600000,
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address || "",
    phone: user.phone || "",
    profileImage: user.profileImage,
    sellerDetails: user.sellerDetails,
  });
});
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profileImage: req.user.profileImage,
    phone: req.user.phone,
    address: req.user.address,
    sellerDetails: user.sellerDetails,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;
  user.address = address || user.address;

  await user.save();

  res.json({
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    res.status(400).json({ message: "Old password is incorrect" });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

module.exports = {
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  loginUser,
  registerUser,
};

const SellerRequest = require("../models/SellerRequest");
const asyncHandler = require("express-async-handler");

const getSellerRequests = asyncHandler(async (req, res) => {
  const sellerRequests = await SellerRequest.find({}).populate(
    "user",
    "name email"
  );
  res.status(200).json(sellerRequests);
});
const getUserSellerRequest = asyncHandler(async (req, res) => {
  const sellerRequest = await SellerRequest.findOne({
    user: req.user._id,
  });

  if (!sellerRequest) {
    res.status(404);
    throw new Error("Seller request not found for this user");
  }

  res.status(200).json(sellerRequest);
});
const createSellerRequest = asyncHandler(async (req, res) => {
  const { businessName, reason } = req.body;

  let existingRequest = await SellerRequest.findOne({ user: req.user._id });

  if (existingRequest) {
    if (existingRequest.status === "Rejected") {
      // Allow re-apply: update the existing request
      existingRequest.businessName = businessName;
      existingRequest.reason = reason;
      existingRequest.status = "Pending";
      await existingRequest.save();
      return res.status(200).json(existingRequest);
    } else {
      res.status(400);
      throw new Error("Seller request already exists for this user");
    }
  }

  const sellerRequest = await SellerRequest.create({
    user: req.user._id,
    businessName,
    reason,
  });

  res.status(201).json(sellerRequest);
});

const User = require("../models/User"); // <-- import the User model

const handleSellerRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const sellerRequest = await SellerRequest.findById(req.params.id);
  if (!sellerRequest) {
    res.status(404);
    throw new Error("Seller request not found");
  }

  sellerRequest.status = status;
  const updatedRequest = await sellerRequest.save();

  const user = await User.findById(sellerRequest.user);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (status === "Approved") {
    user.role = "seller";
    user.businessName = sellerRequest.businessName; // Set business name
  } else if (status === "Rejected") {
    user.role = "user";
    user.businessName = undefined; // Optionally clear business name
  }

  await user.save();

  res.status(200).json(updatedRequest);
});

module.exports = {
  getUserSellerRequest,
  getSellerRequests,
  createSellerRequest,
  handleSellerRequest,
};

const SellerRequest = require("../models/SellerRequest");
const asyncHandler = require("express-async-handler");

const getSellerRequests = asyncHandler(async (req, res) => {
  const sellerRequests = await SellerRequest.find({}).populate(
    "user",
    "name email"
  );
  res.status(200).json(sellerRequests);
});

const createSellerRequest = asyncHandler(async (req, res) => {
  const { businessName } = req.body;

  const existingRequest = await SellerRequest.findOne({ user: req.user._id });
  if (existingRequest) {
    res.status(400);
    throw new Error("Seller request already exists for this user");
  }

  const sellerRequest = await SellerRequest.create({
    user: req.user._id,
    businessName,
  });

  res.status(201).json(sellerRequest);
});

const handleSellerRequest = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const sellerRequest = await SellerRequest.findById(req.params.id);
  if (!sellerRequest) {
    res.status(404);
    throw new Error("Seller request not found");
  }

  sellerRequest.status = status;
  const updatedRequest = await sellerRequest.save();

  res.status(200).json(updatedRequest);
});

module.exports = {
  getSellerRequests,
  createSellerRequest,
  handleSellerRequest,
};

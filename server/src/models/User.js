const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "seller, admin"],
      default: "user",
    },
    isBlocked: { type: Boolean, default: false },
    address: { type: String },
    phone: { type: String },
    profileImage: { type: String, default: "" },
    sellerDetails: {
      businessName: { type: String, default: "" },
      earnings: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

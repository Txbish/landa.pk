const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    image: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quantity: { type: Number, default: 1, min: 1 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);

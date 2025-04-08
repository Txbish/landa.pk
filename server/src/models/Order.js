const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        price: Number,
        itemStatus: {
          type: String,
          enum: ["Pending", "Cancelled", "Completed"],
          default: "Pending",
        },
      },
    ],
    totalAmount: Number,
    overallStatus: {
      type: String,
      enum: ["Pending", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

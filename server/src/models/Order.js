const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
      enum: ["Pending", "Cancelled", "Completed", "Partially Completed"],
      default: "Pending",
    },
    shippingAddress: { type: String, required: true },
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    additionalNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

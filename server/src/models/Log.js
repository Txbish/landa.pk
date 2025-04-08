const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    details: String,
    ip: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Log", logSchema);

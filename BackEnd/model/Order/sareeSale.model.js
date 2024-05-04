const mongoose = require("mongoose");

const sareeSaleSchema = new mongoose.Schema(
  {
    party: {
      type: String,
      required: [true, "Order party name is required"],
    },
    pallu: {
      type: String,
    },
    design: {
      type: String,
      default: null,
    },
    groundColor: {
      type: String,
      required: [true, "Order groundColor is required"],
    },
    stock: {
      type: Number,
    },
    date: {
      type: String,
    },
    matchingId: {
      type: String,
      required: true,
    },
    tokenId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const sareeSaleDetail = mongoose.model("SareeSaleDetail", sareeSaleSchema);
module.exports = sareeSaleDetail;

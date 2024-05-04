const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const yarnPurchaseSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: false,
  },
  lotNo: {
    type: String,
    required: false,
  },
  party: {
    type: String,
    required: false,
  },
  colorCode: {
    type: String,
  },
  colorQuality: {
    type: String,
  },
  date: {
    type: String,
  },
  weight: {
    type: Number,
  },
  denier: {
    type: Number,
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
},{ timestamps: true });

const YarnPurchaseDetail = mongoose.model(
  "YarnPurchaseDetail",
  yarnPurchaseSchema
);
module.exports = YarnPurchaseDetail;

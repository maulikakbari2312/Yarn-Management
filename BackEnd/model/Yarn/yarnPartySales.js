const mongoose = require("mongoose");

const yarnPartySalesSchema = new mongoose.Schema({
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
  price: {
    type: Number,
  },
  tokenId: {
    type: String,
    required: false,
  },
  orderToken: {
    type: String,
    required: false,
  },
},{ timestamps: true });

const YarnPartySalesDetail = mongoose.model(
  "YarnPartySalesDetail",
  yarnPartySalesSchema
);
module.exports = YarnPartySalesDetail;

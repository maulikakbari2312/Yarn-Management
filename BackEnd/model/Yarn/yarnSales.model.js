const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const yarnSalesSchema = new mongoose.Schema({
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
    default: () => uuidv4(),
    required: false,
  },
  orderToken: {
    type: String,
    required: false,
  }
});

const YarnSalesDetail = mongoose.model("YarnSalesDetail", yarnSalesSchema);
module.exports = YarnSalesDetail;

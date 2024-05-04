const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderItemSchema = new mongoose.Schema({
  party: {
    type: String,
    required: [true, "Order party name is required"],
  },
  design: {
    type: String,
    required: [true, "Order design is required"],
  },
  matching:{
    type: String,
  },
  date: {
    type: String,
    required: [true, "Order date is required"],
  },
  rate: {
    type: Number,
    required: [true, "Order rate is required"],
  },
  groundColor: {
    type: String,
    required: [true, "Order groundColor is required"],
  },
  pallu: {
    type: String,
  },
  pcs: {
    type: Number,
    required: [true, "Order totalPcs is required"],
    default: 0
  },
  pendingPcs: {
    type: Number,
    required: [true, "Order pendingPcs is required"],
    default: 0
  },
  completePcs : {
    type: Number,
    required: [true, "Order completePcs is required"],
    default: 0
  },
  dispatch: {
    type: Number,
    required: [true, "Order dispatched is required"],
    default: 0
  },
  settlePcs : {
    type: Number,
    required: [true, "Order settlePcs is required"],
    default: 0
  },
  salePcs : {
    type: Number,
    required: false,
    default: 0
  },
  machineNo:{
    type: Number,
    default: 0
  },
  pcsOnMachine: {
    type: Number,
    default: 0
  },
  orderNo:{
    type: String,
  },
  matchingId: {
    type: String
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  }
});

const orderSchema = new mongoose.Schema({
  orders: [orderItemSchema],
  orderId: {
    type: String
  }
},{ timestamps: true });

const orderDetail = mongoose.model("OrderDetail", orderSchema);
module.exports = orderDetail;

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const processOrderOnMachineSchema = new mongoose.Schema({
  machineNo: {
    type: Number,
    default: 0,
  },
  pcsOnMachine: {
    type: Number,
    default: 0,
  },
  machineId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  }
});

const pcsInMachineSchema = new mongoose.Schema({
  machinesInProcess: [processOrderOnMachineSchema],
  tokenId: {
    type: String,
    required: false,
  },
  orderId: {
    type: String,
    required: false,
  },
});

const pcsInMachineDetail = mongoose.model(
  "PcsInMachineDetail",
  pcsInMachineSchema
);
module.exports = pcsInMachineDetail;

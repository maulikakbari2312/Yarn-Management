const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const machineSchema = new mongoose.Schema({
  machine: {
    type: String,
    unique: true,
    required: [true, "Machine is required"],
  },
  panna: {
    type: String,
    required: [true, "Machine panna is required"],
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
},{ timestamps: true });

const machineDetail = new mongoose.model("MachineDetail", machineSchema);
module.exports = machineDetail;

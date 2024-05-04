const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Party name is required"],
  },
  address: {
    type: String,
    required: [true, "Party address is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Party mobile is required"],
  },
  type: {
    type: String,
    required: [true, "Party type is required"],
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
},{ timestamps: true });

const partyDetail = new mongoose.model("PartyDetail", partySchema);
module.exports = partyDetail;

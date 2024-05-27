const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const matchingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Design name is required"],
  },
  pick: {
    type: Number,
    required: [true, "Design pick is required"],
  },
  pallu: {
    type: String,
    required: false,
  },
  ground: {
    type: String,
    required: [true, "Design ground is required"],
  },
  feeder: {
    type: Number,
    required: [true, "No of Feeder is required"],
  },
  feeders: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  matchingId: {
    type: String
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
});

const matchingDetail = new mongoose.model("MatchingDetail", matchingSchema);
module.exports = matchingDetail;

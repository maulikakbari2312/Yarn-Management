const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Design name is required"],
  },
  pick: {
    type: Number,
    required: [true, "Design pick is required"],
  },
  reed: {
    type: Number,
    default: null,
  },
  avgPick: {
    type: Number,
    default: null,
  },
  totalCards: {
    type: Number,
    default: null,
  },
  finalCut: {
    type: Number,
    default: null,
  },
  ground: {
    type: Number,
    default: null,
  },
  pallu: {
    type: Number,
    default: null,
  },
  hook: {
    type: Number,
    required: [true, "Design hook is required"],
  },
  dashRepeat: {
    type: Number,
    required: [true, "Design dashRepeat is required"],
  },
  feeder: {
    type: Number,
    required: [true, "Design feeder is required"],
  },
  image: {
    type: String,
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
  feeders: {
    type: Array,
    default: [],
  },
},{ timestamps: true });

const DesignDetail = mongoose.model("DesignDetail", designSchema);

module.exports = DesignDetail;

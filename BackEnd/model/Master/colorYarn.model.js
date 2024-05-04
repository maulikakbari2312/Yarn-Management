const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const colorYarnSchema = new mongoose.Schema({
  colorCode: {
    type: String,
    unique: [true, "colorCode can not be same"],
    required: [true, "ColorYarn colorCode is required"],
  },
  colorQuality: {
    type: String,
    unique: false,
    required: [true, "ColorYarn colorQuality is required"],
  },
  denier: {
    type: Number,
    required: [true, "ColorYarn weight is required"],
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
},{ timestamps: true });

const colorYarnDetail = new mongoose.model("ColorYarnDetail", colorYarnSchema);
module.exports = colorYarnDetail;

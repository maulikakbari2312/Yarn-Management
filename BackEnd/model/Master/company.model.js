const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Company name is required"],
  },
  address: {
    type: String,
    required: [true, "Company address is required"],
  },
  mobile: {
    type: Number,
    required: [true, "Company mobile is required"],
  },
  tokenId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  },
},{ timestamps: true });

const companyDetail = new mongoose.model("CompanyDetail", companySchema);
module.exports = companyDetail;

const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");


const orderIdSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: () => uuidv4(),
    required: false,
  }
});

const orderIdDetail = mongoose.model("OrderIdDetail", orderIdSchema);
module.exports = orderIdDetail;

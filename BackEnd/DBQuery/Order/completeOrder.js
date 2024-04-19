const ordersModel = require("../../model/Order/orders.model");
const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");
const orderIdModel = require("../../model/Order/orderId.model");


exports.findOrderByOrderId = async (orderId) => {
  const getOrders = await ordersModel.findOne({ orderId: orderId });
  return getOrders;
};

exports.findMachinePcs = async () => {
  const getProcessPcs = await pcsOnMachineModel.find();
  return getProcessPcs;
};

exports.findAllOrders = async () => {
  const getOrders = await ordersModel.find();
  return getOrders;
};

exports.createIdOfOrder = async () => {
    const createOrderId = await new orderIdModel()
    return createOrderId;
  };

  exports.generateNewOrder = async (orderDetail,orderId) => {
    const createOrder = await new ordersModel({
      orders: [orderDetail],
      orderId: orderId,
    })
    return createOrder;
  };

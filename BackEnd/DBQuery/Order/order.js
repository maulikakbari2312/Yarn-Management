const ordersModel = require("../../model/Order/orders.model");
const orderIdModel = require("../../model/Order/orderId.model");

exports.findOrderByOrderId = async (orderId) => {
  const getOrders = await ordersModel.findOne({ orderId: orderId });
  return getOrders;
};

exports.deleteOrderByOrderId = async (orderId) => {
  const deleteOrder = await ordersModel.deleteOne({
    orderId: orderId,
  });
  return deleteOrder;
};

exports.findAllOrders = async () => {
  const getOrders = await ordersModel.find().sort({ createdAt: -1 });
  return getOrders;
};

exports.createIdOfOrder = async () => {
  const createOrderId = await new orderIdModel();
  return createOrderId;
};

exports.generateNewOrder = async (orderDetail, orderId) => {
  const createOrder = await new ordersModel({
    orders: [orderDetail],
    orderId: orderId,
  });
  return createOrder;
};

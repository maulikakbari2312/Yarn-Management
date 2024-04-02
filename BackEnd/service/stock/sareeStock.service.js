const ordersModel = require("../../model/Order/orders.model");

exports.getSareeStock = async () => {
  try {
    const findOrders = await ordersModel.find();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const completeOrderArr = [];
    for (const order of findOrders) {
      for (const ele of order.orders) {
        completeOrderArr.push(ele);
      }
    }
    const newArr = [];
    for (const ele of completeOrderArr) {
      if (ele.completePcs > 0) {
        newArr.push(ele);
      }
    }

    const resultObject = {};

    newArr.forEach((item) => {
      if (resultObject[item.matchingId]) {
        resultObject[item.matchingId].completePcs += item.completePcs;
      } else {
        resultObject[item.matchingId] = {
          matchingId: item.matchingId,
          party: item.party,
          pallu: item.pallu,
          design: item.design,
          groundColor: item.groundColor,
          completePcs: item.completePcs,
        };
      }
    });

    const resultArray = Object.values(resultObject);

    return resultArray;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

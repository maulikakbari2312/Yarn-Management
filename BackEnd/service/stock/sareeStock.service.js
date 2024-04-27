const { findAllOrders } = require("../../DBQuery/Order/completeOrder");
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
      if (ele.settlePcs > 0) {
        newArr.push(ele);
      }
    }

    const resultObject = {};

    newArr.forEach((item) => {
      if (resultObject[item.matchingId]) {
        resultObject[item.matchingId].completePcs += item.settlePcs;
      } else {
        resultObject[item.matchingId] = {
          matchingId: item.matchingId,
          party: item.party,
          pallu: item.pallu,
          design: item.design,
          groundColor: item.groundColor,
          completePcs: item.settlePcs,
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

exports.editSareeStock = async (tokenId, matchingId, returnPcs) => {
  try {
    const findOrders = await findAllOrders();

    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.tokenId === tokenId && ele.matchingId === matchingId) {
          ele.settlePcs += returnPcs;
          ele.dispatch -= returnPcs;
          order.save();
        }
      }
    }
    return {
      status: 200,
      message: "Return saree stock updated successfully.",
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

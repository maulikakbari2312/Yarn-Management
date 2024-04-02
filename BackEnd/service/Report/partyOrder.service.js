const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");
const ordersModel = require("../../model/Order/orders.model");
const message = require("../../common/error.message");

exports.getPartyOrder = async (party, design) => {
  try {
    const findOrder = await ordersModel.find();

    if (!findOrder) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const arr = [];
    for (const data of findOrder) {
      for (const ele of data.orders) {
        if (ele.party === party && ele.design === design) {
          arr.push(ele);
        }
      }
    }

    const sumPcsByDesign = arr.reduce((accumulator, order) => {
      let { pcs } = order;
      accumulator += pcs;
      return accumulator;
    }, 0);

    const sumPendingPcsByDesign = arr.reduce((accumulator, order) => {
      let { pendingPcs } = order;
      accumulator += pendingPcs;
      return accumulator;
    }, 0);

    return {
      status: 200,
      message: message.ORDER_FIND_SUCCESSFULLY,
      pageItems: arr,
      totalPcs: sumPcsByDesign,
      pendingPcs: sumPendingPcsByDesign,
    };
  } catch (error) {
    throw error;
  }
};

exports.findPartyDesign = async (party) => {
  try {
    const findOrder = await ordersModel.find();

    if (!findOrder) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const arr = [];
    for (const data of findOrder) {
      for (const ele of data.orders) {
        if (ele.party === party) {
          arr.push(ele);
        }
      }
    }

    let findDesign = arr.map((ele) => ele.design);

    const uniqueDesign = Array.from(new Set(findDesign));

    return {
      status: 200,
      message: message.DESIGN_FIND_SUCCESSFULLY,
      pageItems: uniqueDesign,
    };
  } catch (error) {
    throw error;
  }
};

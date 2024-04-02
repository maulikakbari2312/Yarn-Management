const message = require("../../common/error.message");
const ordersModel = require("../../model/Order/orders.model");
const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");

exports.completeProcessOrder = async (
  orderId,
  tokenId,
  machineId,
  complete
) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });
    const findOrderOnMachine = await pcsOnMachineModel.find();

    if (!findByOrderId) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const processOrderArr = [];
    for (const ele of findByOrderId.orders) {
      if (ele.pcsOnMachine > 0) {
        processOrderArr.push(ele);
      }
    }

    if (complete === true) {
      const findProcessOrder = processOrderArr.find(
        (ele) => ele.tokenId === tokenId
      );

      if (!findProcessOrder) {
        return {
          status: 404,
          message: "processOrder can not find",
        };
      }
      if (findProcessOrder.completePcs > findProcessOrder.pcs) {
        return {
          status: 404,
          message: `Only ${findProcessOrder.pcsOnMachine} processOrder available.`,
        };
      }

      for (const detail of findOrderOnMachine) {
        for (const machineData of detail.machinesInProcess) {
          if (machineData.machineId === machineId) {
            findProcessOrder.pcsOnMachine =
              findProcessOrder.pcsOnMachine - machineData.pcsOnMachine;
            findProcessOrder.completePcs =
              findProcessOrder.completePcs + machineData.pcsOnMachine;
          }
        }
      }

      for (const detail of findOrderOnMachine) {
        for (const machineData of detail.machinesInProcess) {
          for (const data of processOrderArr) {
            if (detail.tokenId === data.tokenId) {
              if (machineData.machineNo === machineId) {
                machineData.pcsOnMachine =
                  machineData.pcsOnMachine - data.completePcs;
                break;
              }
            }
          }
        }
      }

      for (const detail of findOrderOnMachine) {
        detail.machinesInProcess = detail.machinesInProcess.filter(
          (detail) => detail.machineId !== machineId
        );
        await detail.save();
      }

      await findByOrderId.save();
      return {
        status: 200,
        message: message.PROCESS_ORDER_SUCESS,
        data: processOrderArr,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getCompleteOrder = async (orderId) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });

    if (!findByOrderId) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const completeOrderArr = [];
    for (const ele of findByOrderId.orders) {
      if (ele.completePcs > 0) {
        completeOrderArr.push(ele);
      }
    }

    return completeOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.createCompleteOrder = async (orderId, tokenId, body) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId });

    if (!findByOrderId) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    let orderToUpdate = findByOrderId.orders.find(
      (ele) => ele.tokenId === tokenId
    );

    if (!orderToUpdate) {
      return {
        status: 404,
        message: "Order cannot be updated",
      };
    }

    switch (body.dispatch ? "dispatch" : "settle") {
      case "dispatch":
        if (orderToUpdate.completePcs > orderToUpdate.pcs) {
          return {
            status: 404,
            message: `Only ${orderToUpdate.pcs} total Pieces available.`,
          };
        }

        if (orderToUpdate.completePcs < body.dispatch) {
          return {
            status: 404,
            message: `Only ${orderToUpdate.completePcs} complete order available.`,
          };
        }

        if (orderToUpdate.dispatch === 0) {
          orderToUpdate.dispatch = body.dispatch;
        } else {
          orderToUpdate.dispatch = orderToUpdate.dispatch + body.dispatch;
        }
        orderToUpdate.completePcs = orderToUpdate.completePcs - body.dispatch;
        const dispatchOrder = await findByOrderId.save();
        return {
          status: 200,
          message: message.COMPLETE_ORDER_SUCESS,
          data: dispatchOrder,
        };

      case "settle":
        if (orderToUpdate.pendingPcs > orderToUpdate.pcs) {
          return {
            status: 404,
            message: `Only ${orderToUpdate.completePcs} complete order available.`,
          };
        }

        if (orderToUpdate.completePcs < body.settle) {
          return {
            status: 404,
            message: `only ${orderToUpdate.completePcs} complete order available.`,
          };
        }
        if (orderToUpdate.settlePcs === 0) {
          orderToUpdate.settlePcs = body.settle;
        } else {
          orderToUpdate.settlePcs = orderToUpdate.settlePcs + body.settle;
        }
        orderToUpdate.completePcs = orderToUpdate.completePcs - body.settle;
        const settleOrder = await findByOrderId.save();
        return {
          status: 200,
          message: message.COMPLETE_ORDER_SUCESS,
          data: settleOrder,
        };
        break;

      default:
        return {
          status: 404,
          message: "Invalid operation",
        };
    }

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getDeliveredOrder = async () => {
  try {
    const findOrders = await ordersModel.find();

    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    let dispatchedOrderArr = [];
    let settledOrderArr = [];

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.dispatch > 0) {
          const response = {
            date: ele.date,
            orderNo: ele.orderNo,
            party: ele.party,
            design: ele.design,
            groundColor: ele.groundColor,
            dispatch: ele.dispatch,
            settlePcs: ele.settlePcs,
            tokenId: ele.tokenId,
            orderId: ele.orderNo,
            matchingId: ele.matchingId,
          };
          dispatchedOrderArr.push(response);
        }
        if (ele.settlePcs > 0) {
          const response = {
            date: ele.date,
            orderNo: ele.orderNo,
            party: ele.party,
            design: ele.design,
            groundColor: ele.groundColor,
            dispatch: ele.dispatch,
            settlePcs: ele.settlePcs,
            tokenId: ele.tokenId,
            orderId: ele.orderNo,
            matchingId: ele.matchingId,
          };
          settledOrderArr.push(response);
        }
      }
    }
    const dispatchObject = {};
    dispatchedOrderArr.forEach((ele) => {
      const key = `${ele.orderNo}_${ele.party}_${ele.design}_${ele.matchingId}_${ele.groundColor}`;
      if (!dispatchObject[key]) {
        dispatchObject[key] = {
          ...ele,
          dispatch: ele.dispatch,
        };
      } else {
        dispatchObject[key].dispatch =
          dispatchObject[key].dispatch + ele.dispatch;
      }
    });
    
    const dispatchArray = Object.values(dispatchObject);

    const settleObject = {};
    settledOrderArr.forEach((ele) => {
      const key = `${ele.orderNo}_${ele.party}_${ele.design}_${ele.matchingId}_${ele.groundColor}`;
      if (!settleObject[key]) {
        settleObject[key] = {
          ...ele,
          dispatch: ele.dispatch,
        };
      } else {
        settleObject[key].dispatch = settleObject[key].dispatch + ele.dispatch;
      }
    });
    const settleArray = Object.values(settleObject); 
    const commonObj = [...dispatchArray, ...settleArray];

    const uniqueOrdersSet = new Set();

    const combinedOrders = commonObj.filter((ele) => {
      const key = `${ele.orderNo}_${ele.party}_${ele.design}_${ele.matchingId}_${ele.groundColor}`;
      if (!uniqueOrdersSet.has(key)) {
        uniqueOrdersSet.add(key);
        return true;
      }
      return false;
    });

    return combinedOrders;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getAllCompleteOrder = async () => {
  try {
    const findOrders = await ordersModel.find();
    const processOrderArr = [];

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.completePcs > 0) {
          const response = {
            orderNo: ele.orderNo,
            date: ele.date,
            party: ele.party,
            design: ele.design,
            machineNo: ele.machineNo,
            groundColor: ele.groundColor,
            completePcs: ele.completePcs,
            tokenId: ele.tokenId,
            orderId: order.orderId,
          };
          processOrderArr.push(response);
        }
      }
    }

    return processOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
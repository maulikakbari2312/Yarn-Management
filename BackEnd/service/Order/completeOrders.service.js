const message = require("../../common/error.message");
const {
  findOrderByOrderId,
  findAllOrders,
} = require("../../DBQuery/Order/order");
const { findAllMatchings } = require("../../DBQuery/Master/matching");
const { findAllSaleYarn } = require("../../DBQuery/Yarn/sales");
const { findDesigns } = require("../../DBQuery/Master/design");
const { findYarnColor } = require("../../DBQuery/Master/colorYarn");
const { findMachinePcs } = require("../../DBQuery/Order/pcsOnMachine");

exports.completeProcessOrder = async (
  orderId,
  tokenId,
  machineId,
  complete
) => {
  try {
    const findByOrderId = await findOrderByOrderId(orderId);
    const findOrderOnMachine = await findMachinePcs();

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
      await YarnWeightCalculation(orderId);
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
    const findByOrderId = await findOrderByOrderId(orderId);

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
    const findByOrderId = await findOrderByOrderId(orderId);

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
        await YarnWeightCalculation(orderId);

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
        await YarnWeightCalculation(orderId);

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
    const findOrders = await findAllOrders();

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
    const findOrders = await findAllOrders();
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

async function YarnWeightCalculation(orderId) {
  const findByOrderId = await findOrderByOrderId(orderId);
  const pendingOrderArr = [];
  for (const order of findByOrderId?.orders) {
    pendingOrderArr.push(order);
  }
  const pendingNewArr = [];
  for (const ele of pendingOrderArr) {
    if (
      ele.completePcs > 0 ||
      ele.pcsOnMachine > 0 ||
      ele.dispatch > 0 ||
      ele.settlePcs > 0 ||
      ele.salePcs > 0
    ) {
      pendingNewArr.push(ele);
    }
  }

  const salesDetails = await findAllSaleYarn();

  const listOfOrders = [];
  const findMatchings = await findAllMatchings();
  for (const ele of findMatchings) {
    for (const data of pendingNewArr) {
      if (ele?.matchingId === data?.matchingId) {
        listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
      }
    }
  }

  const findFeeders = listOfOrders;
  const findColorYarn = await findYarnColor();
  const findPickByDesign = await findDesigns();
  const denierSet1 = [];

  for (const feeder of findFeeders) {
    const denierSet = [];
    for (const [key, colorCode] of Object.entries(feeder)) {
      const matchingColorYarn = findColorYarn.find(
        (yarn) => yarn.colorCode === colorCode
      );
      if (matchingColorYarn) {
        const feederDenierInfo = {};
        feederDenierInfo[key] = colorCode;
        feederDenierInfo["denier"] = matchingColorYarn.denier;
        feederDenierInfo["matchingId"] = feeder.matchingId;
        denierSet.push(feederDenierInfo);
      }
    }
    if (denierSet.length > 0) {
      denierSet1.push(denierSet);
    }
  }
  let mergedObjects1 = [];
  const designArr = [];
  for (const data of pendingNewArr) {
    designArr.push(data.design);
  }

  for (let i = 0; i < denierSet1.length; i++) {
    const ele = denierSet1[i];
    const result = ele.map((eleObj, index) => {
      const getMatchingId = findMatchings.find(
        (element) => element.matchingId === eleObj.matchingId
      );
      const findOrderToken = pendingNewArr.find(
        (ele) => ele.matchingId === eleObj.matchingId
      );
      const findDesign = findPickByDesign.find(
        (design) => design.name === getMatchingId.name
      );
      if (getMatchingId) {
        const pickKey = `pick-${index + 1}`;
        const pickValue = findDesign.feeders[index]
          ? findDesign.feeders[index][pickKey]
          : null;
        const finalCut = findDesign.finalCut ? findDesign.finalCut : null;
        const orderMatchingToken = findOrderToken.tokenId
          ? findOrderToken.tokenId
          : null;
        return {
          ...eleObj,
          pick: pickValue,
          finalCut: finalCut,
          orderMatchingToken: orderMatchingToken,
        };
      } else {
        return eleObj;
      }
    });
    mergedObjects1.push(result);
  }

  mergedObjects1 = mergedObjects1
    .flatMap((arr) => (Array.isArray(arr) ? arr : [arr]))
    .filter((obj) => obj.hasOwnProperty("pick"));
  const calculatYarnWeight = (denier, pick, order, finalCut) =>
    (denier * pick * order * finalCut * 52 * 1) / 9000000;
  const resultArray = [];
  for (const data of mergedObjects1) {
    const arrayWeight = 0;
    const findOrder = pendingNewArr.find(
      (order) => order.matchingId === data?.matchingId
    );
    const totalWeight =
      arrayWeight +
      calculatYarnWeight(
        Number(data?.denier),
        Number(data?.pick),
        Number(findOrder.pcsOnMachine) +
          Number(findOrder.completePcs) +
          Number(findOrder.dispatch) +
          Number(findOrder.settlePcs) +
          Number(findOrder.salePcs),
        Number(data?.finalCut)
      );
    const calculatedObj = {
      ...data,
      weight: totalWeight,
    };
    resultArray.push(calculatedObj);
  }
  console.log("===resultArray===", resultArray);

  const pageItems = resultArray.map((obj) => {
    const keys = Object.keys(obj);
    const firstKey = keys[0];
    const feeders = firstKey.replace(/f\d+/, "feeders");
    const newObj = { [feeders]: obj[firstKey] };

    keys.slice(1).forEach((key) => {
      newObj[key] = obj[key];
    });

    return newObj;
  });
  console.log("==pageItems===", pageItems);

  const accumulatedWeights = {};
  for (const item of pageItems) {
    const { feeders, weight, orderMatchingToken } = item;

    const key = `${feeders}:${item.matchingId}:${orderMatchingToken}`;

    if (!accumulatedWeights[key]) {
      accumulatedWeights[key] = weight;
    } else {
      accumulatedWeights[key] += weight;
    }
  }

  for (const key of Object.keys(accumulatedWeights)) {
    const [feeders, matchingId, orderMatchingToken] = key.split(":");
    const accumulatedWeight = accumulatedWeights[key];
    for (const detail of salesDetails) {
      if (
        detail.orderToken === orderMatchingToken &&
        detail.colorCode === feeders
      ) {
        detail.colorCode = feeders;
        detail.weight = accumulatedWeight;
        await detail.save();
      }
    }
  }
}

const message = require("../../common/error.message");
const ordersModel = require("../../model/Order/orders.model");
const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");
const matchingModel = require("../../model/Master/matching.model");
const YarnSalesDetail = require("../../model/Yarn/yarnSales.model");
// const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");
const designModel = require("../../model/Master/design.model");
const colorYarnModel = require("../../model/Master/colorYarn.model");

exports.createProcessOrder = async (orderId, tokenId, data) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });
    const findOrderOnMachine = await pcsOnMachineModel.find();
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
        message: "Order can not update",
      };
    }

    for (const detail of findOrderOnMachine) {
      for (const machineData of detail.machinesInProcess) {
        if (
          machineData.machineNo === data.machineNo &&
          machineData.pcsOnMachine > 0
        ) {
          const findOrder = findByOrderId.orders.find(
            (ele) => ele.tokenId === detail.tokenId
          );

          if (!findOrder) {
            return {
              status: 404,
              message: "Machine is inProcess with other order.",
            };
          }

          if (findOrder.tokenId !== tokenId) {
            return {
              status: 404,
              message: "Another ground color order is inProcess.",
            };
          }
          if (detail.orderId !== orderId && detail.tokenId !== tokenId) {
            return {
              status: 404,
              message: "Another order is already in process.",
            };
          }
        }
      }
    }

    orderToUpdate.machineNo = data.machineNo;
    if (!orderToUpdate.pendingPcs > orderToUpdate.pcs) {
      return {
        status: 404,
        message: `Only ${orderToUpdate.pcs} orders are pending.`,
      };
    }

    if (orderToUpdate.pendingPcs < data.pcsOnMachine) {
      return {
        status: 404,
        message: `Only ${orderToUpdate.pendingPcs} orders are pending.`,
      };
    }

    if (orderToUpdate.pcsOnMachine === 0) {
      orderToUpdate.pcsOnMachine = data.pcsOnMachine;
    } else {
      orderToUpdate.pcsOnMachine =
        orderToUpdate.pcsOnMachine + data.pcsOnMachine;
    }
    orderToUpdate.pendingPcs = orderToUpdate.pendingPcs - data.pcsOnMachine;

    const updatedOrder = await findByOrderId.save();

    const findOrderInProcess = await pcsOnMachineModel.findOne({
      orderId: orderId,
      tokenId: tokenId,
    });

    if (!findOrderInProcess) {
      const createOrderDetail = new pcsOnMachineModel({
        machinesInProcess: [
          {
            machineNo: data.machineNo,
            pcsOnMachine: data.pcsOnMachine,
          },
        ],
        orderId: orderId,
        tokenId: tokenId,
      });

      await createOrderDetail.save();
    } else {
      let machineFound = false;
      for (const ele of findOrderInProcess.machinesInProcess) {
        if (ele.machineNo === data.machineNo) {
          ele.pcsOnMachine = ele.pcsOnMachine + data.pcsOnMachine;
          machineFound = true;
          break;
        }
      }
      if (!machineFound) {
        findOrderInProcess.machinesInProcess.push({
          machineNo: data.machineNo,
          pcsOnMachine: data.pcsOnMachine,
        });
      }
      await findOrderInProcess.save();
    }

    const pendingOrderArr = [];
    for (const order of findByOrderId?.orders) {
      pendingOrderArr.push(order);
    }
    const pendingNewArr = [];
    for (const ele of pendingOrderArr) {
      if (ele.pcsOnMachine > 0) {
        pendingNewArr.push(ele);
      }
    }
    // const matchingId = new Set(pendingNewArr.map((ele) => ele.matchingId));
    // const matchingArray = Array.from(matchingId);

    const findMatching = await matchingModel.find();

    // let colorYarn = [];
    // for (const ele of findMatching) {
    //   for (const matching of matchingArray) {
    //     if (ele.matchingId === matching) {
    //       colorYarn.push(ele.feeders);
    //     }
    //   }
    // }
    // const uniqueValues = new Set();

    // colorYarn.forEach((obj) => {
    //   Object.values(obj).forEach((value) => {
    //     uniqueValues.add(value);
    //   });
    // });

    // const uniqueArray = [...uniqueValues];
    // const purchaseDetails = await yarnPurchaseModel.find();
    const salesDetails = await YarnSalesDetail.find();

    // const purchaseAggregationMap = purchaseDetails.reduce((map, detail) => {
    //   const key = `${detail.colorCode}:${detail.colorQuality}`;
    //   if (!map[key]) {
    //     map[key] = { weight: 0, denier: detail.denier };
    //   }

    //   map[key].weight += detail.weight;
    //   return map;
    // }, {});
    // const purchaseResult = Object.entries(purchaseAggregationMap).map(
    //   ([key, values]) => {
    //     const [colorCode, colorQuality] = key.split(":");
    //     return {
    //       Color: colorCode,
    //       colorQuality,
    //       weight: values.weight,
    //       denier: values.denier,
    //     };
    //   }
    // );

    // const salesAggregationMap = salesDetails.reduce((map, detail) => {
    //   const key = `${detail.colorCode}:${detail.colorQuality}`;
    //   if (!map[key]) {
    //     map[key] = { weight: 0, denier: detail.denier };
    //   }

    //   map[key].weight += detail.weight;

    //   return map;
    // }, {});
    // const salesResult = Object.entries(salesAggregationMap).map(
    //   ([key, values]) => {
    //     const [colorCode, colorQuality] = key.split(":");
    //     return {
    //       Color: colorCode,
    //       colorQuality,
    //       weight: values.weight,
    //       denier: values.denier,
    //     };
    //   }
    // );

    // const purchaseDictionary = purchaseResult.reduce((dict, item) => {
    //   const key = `${item.Color}-${item.colorQuality}`;
    //   dict[key] = item;
    //   return dict;
    // }, {});
    // const salesDictionary = salesResult.reduce((dict, item) => {
    //   const key = `${item.Color}-${item.colorQuality}`;
    //   dict[key] = item;
    //   return dict;
    // }, {});

    // const yarnStock = Object.keys(purchaseDictionary).map((key) => {
    //   const purchaseItem = purchaseDictionary[key] || { weight: 0 };
    //   const salesItem = salesDictionary[key] || { weight: 0 };

    //   return {
    //     colorCode: purchaseItem.Color,
    //     colorQuality: purchaseItem.colorQuality,
    //     weight: purchaseItem.weight - salesItem.weight,
    //     denier: purchaseItem.denier,
    //   };
    // });
    const listOfOrders = [];
    const findMatchings = await matchingModel.find();
    for (const ele of findMatchings) {
      for (const data of pendingNewArr) {
        if (ele?.matchingId === data?.matchingId) {
          listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
        }
      }
    }

    const findFeeders = listOfOrders;
    const findColorYarn = await colorYarnModel.find();
    const findPickByDesign = await designModel.find();
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

    const findDesign = findPickByDesign.find((design) =>
      designArr.some((ele) => ele === design.name)
    );

    if (findDesign) {
      for (let i = 0; i < denierSet1.length; i++) {
        const ele = denierSet1[i];
        const result = ele.map((eleObj, index) => {
          const getMatchingId = findMatching.find(
            (element) => element.matchingId === eleObj.matchingId
          );
          if (getMatchingId && getMatchingId.name === findDesign.name) {
            const pickKey = `pick-${index + 1}`;
            const pickValue = findDesign.feeders[index]
              ? findDesign.feeders[index][pickKey]
              : null;
            const finalCut = findDesign.finalCut ? findDesign.finalCut : null;
            return { ...eleObj, pick: pickValue, finalCut: finalCut };
          } else {
            return eleObj;
          }
        });
        mergedObjects1.push(result);
      }
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
          findOrder.pcsOnMachine,
          Number(data?.finalCut)
        );
      const calculatedObj = {
        ...data,
        weight: totalWeight,
      };
      resultArray.push(calculatedObj);
    }
    const newArray = resultArray.map((obj) => {
      const { denier, matchingId, pick, ...rest } = obj;
      return rest;
    });

    const mergedObjects = {};

    newArray.forEach((obj) => {
      const key = Object.values(obj)[0];
      if (mergedObjects[key]) {
        mergedObjects[key].weight += obj?.weight;
      } else {
        mergedObjects[key] = obj;
      }
    });

    let pageItems = Object.values(mergedObjects);
    pageItems = pageItems.map((obj) => {
      const keys = Object.keys(obj);
      const firstKey = keys[0];
      const updatedObj = {};
      const feederNumber = firstKey.replace(/f\d+/, "feeders");
      updatedObj[feederNumber] = obj[firstKey];
      keys.slice(1).forEach((key) => {
        updatedObj[key] = obj[key];
      });
      updatedObj["weight"] = parseFloat(obj["weight"].toFixed(4));
      return updatedObj;
    });
    for (const item of pageItems) {
      const { feeders, weight } = item;
      for (let detail of salesDetails) {
        if (detail.orderToken === tokenId && detail.colorCode === feeders) {
          detail.colorCode = feeders;
          detail.weight = weight;
          await detail.save();
        }
      }
    }
    return {
      status: 200,
      message: message.PROCESS_ORDER_SUCESS,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getProcessOrder = async (orderId) => {
  try {
    const findByOrderId = await ordersModel.findOne({ orderId: orderId });

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

    return processOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getAllProcessOrder = async () => {
  try {
    const findOrders = await ordersModel.find();
    const findOrderOnMachine = await pcsOnMachineModel.find();

    const processOrderArr = [];

    for (const order of findOrders) {
      for (const ele of order.orders) {
        for (const detail of findOrderOnMachine) {
          for (const machineData of detail.machinesInProcess) {
            if (
              machineData.pcsOnMachine > 0 &&
              ele.tokenId === detail.tokenId
            ) {
              const response = {
                orderNo: ele.orderNo,
                date: ele.date,
                party: ele.party,
                design: ele.design,
                machineNo: machineData.machineNo,
                groundColor: ele.groundColor,
                pcsOnMachine: machineData.pcsOnMachine,
                tokenId: ele.tokenId,
                orderId: order.orderId,
                machineId: machineData.machineId,
              };
              processOrderArr.push(response);
            }
          }
        }
      }
    }

    return processOrderArr;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.deleteAllProcessOrder = async (orderId, tokenId, machineId) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });

    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    const findOrderOnMachine = await pcsOnMachineModel.find({
      orderId: orderId,
    });

    let processOrderArr = [];

    for (const ele of findOrders.orders) {
      for (const detail of findOrderOnMachine) {
        for (const machineData of detail.machinesInProcess) {
          if (
            machineData.pcsOnMachine > 0 &&
            findOrders.orderId === detail.orderId
          ) {
            const response = {
              orderNo: ele.orderNo,
              date: ele.date,
              party: ele.party,
              design: ele.design,
              machineNo: machineData.machineNo,
              groundColor: ele.groundColor,
              pcsOnMachine: machineData.pcsOnMachine,
              tokenId: ele.tokenId,
              orderId: orderId,
              machineId: machineData.machineId,
            };
            processOrderArr.push(response);
          }
        }
      }
    }

    let findOrder = findOrders.orders.find(
      (order) => order.tokenId === tokenId
    );

    let pcsOnMachineToUpdate = 0;

    for (const data of findOrderOnMachine) {
      const filter = {
        orderId: orderId,
        tokenId: tokenId,
      };

      const update = {
        $pull: {
          machinesInProcess: { machineId: machineId },
        },
      };

      await pcsOnMachineModel.updateOne(filter, update);

      const removedObjectIndex = data.machinesInProcess.findIndex(
        (obj) => obj.machineId === machineId
      );
      if (removedObjectIndex !== -1) {
        pcsOnMachineToUpdate =
          pcsOnMachineToUpdate +
          data.machinesInProcess[removedObjectIndex].pcsOnMachine;
        data.machinesInProcess.splice(removedObjectIndex, 1);
      }
    }

    findOrder.pcsOnMachine = findOrder.pcsOnMachine - pcsOnMachineToUpdate;
    findOrder.pendingPcs = findOrder.pendingPcs + pcsOnMachineToUpdate;

    const pendingProcessPcs = processOrderArr.filter(
      (ele) => ele.machineId !== machineId
    );

    await findOrders.save();
    return pendingProcessPcs;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.editAllProcessOrder = async (
  orderId,
  tokenId,
  machineId,
  updatedPcsOnMachine
) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });
    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    const findOrderOnMachine = await pcsOnMachineModel.findOne({
      orderId: orderId,
      tokenId: tokenId,
      "machinesInProcess.machineId": machineId,
    });
    if (!findOrderOnMachine) {
      return {
        status: 404,
        message: "Order with the specified machine ID not found.",
      };
    }

    const machineData = findOrderOnMachine.machinesInProcess.find(
      (machine) => machine.machineId === machineId
    );
    const updatedOrder = findOrders.orders.find(
      (order) => order.tokenId === tokenId
    );

    let diffPcs = 0;
    if (updatedOrder.pcsOnMachine > updatedPcsOnMachine) {
      diffPcs = updatedOrder.pcsOnMachine - updatedPcsOnMachine;
      updatedOrder.pendingPcs = updatedOrder.pendingPcs + diffPcs;
      updatedOrder.pcsOnMachine = updatedPcsOnMachine;
    } else {
      diffPcs = updatedPcsOnMachine - updatedOrder.pcsOnMachine;
      updatedOrder.pendingPcs = updatedOrder.pendingPcs - diffPcs;
      updatedOrder.pcsOnMachine = updatedPcsOnMachine;
    }

    machineData.pcsOnMachine = updatedPcsOnMachine;

    await findOrders.save();
    await findOrderOnMachine.save();

    const pendingOrderArr = [];
    for (const order of findOrders?.orders) {
      pendingOrderArr.push(order);
    }
    const pendingNewArr = [];
    for (const ele of pendingOrderArr) {
      if (ele.pcsOnMachine > 0) {
        pendingNewArr.push(ele);
      }
    }
    // const matchingId = new Set(pendingNewArr.map((ele) => ele.matchingId));
    // const matchingArray = Array.from(matchingId);

    const findMatching = await matchingModel.find();

    // let colorYarn = [];
    // for (const ele of findMatching) {
    //   for (const matching of matchingArray) {
    //     if (ele.matchingId === matching) {
    //       colorYarn.push(ele.feeders);
    //     }
    //   }
    // }
    // const uniqueValues = new Set();

    // colorYarn.forEach((obj) => {
    //   Object.values(obj).forEach((value) => {
    //     uniqueValues.add(value);
    //   });
    // });

    // const uniqueArray = [...uniqueValues];
    // const purchaseDetails = await yarnPurchaseModel.find();
    const salesDetails = await YarnSalesDetail.find();

    // const purchaseAggregationMap = purchaseDetails.reduce((map, detail) => {
    //   const key = `${detail.colorCode}:${detail.colorQuality}`;
    //   if (!map[key]) {
    //     map[key] = { weight: 0, denier: detail.denier };
    //   }

    //   map[key].weight += detail.weight;
    //   return map;
    // }, {});
    // const purchaseResult = Object.entries(purchaseAggregationMap).map(
    //   ([key, values]) => {
    //     const [colorCode, colorQuality] = key.split(":");
    //     return {
    //       Color: colorCode,
    //       colorQuality,
    //       weight: values.weight,
    //       denier: values.denier,
    //     };
    //   }
    // );

    // const salesAggregationMap = salesDetails.reduce((map, detail) => {
    //   const key = `${detail.colorCode}:${detail.colorQuality}`;
    //   if (!map[key]) {
    //     map[key] = { weight: 0, denier: detail.denier };
    //   }

    //   map[key].weight += detail.weight;

    //   return map;
    // }, {});
    // const salesResult = Object.entries(salesAggregationMap).map(
    //   ([key, values]) => {
    //     const [colorCode, colorQuality] = key.split(":");
    //     return {
    //       Color: colorCode,
    //       colorQuality,
    //       weight: values.weight,
    //       denier: values.denier,
    //     };
    //   }
    // );

    // const purchaseDictionary = purchaseResult.reduce((dict, item) => {
    //   const key = `${item.Color}-${item.colorQuality}`;
    //   dict[key] = item;
    //   return dict;
    // }, {});
    // const salesDictionary = salesResult.reduce((dict, item) => {
    //   const key = `${item.Color}-${item.colorQuality}`;
    //   dict[key] = item;
    //   return dict;
    // }, {});

    // const yarnStock = Object.keys(purchaseDictionary).map((key) => {
    //   const purchaseItem = purchaseDictionary[key] || { weight: 0 };
    //   const salesItem = salesDictionary[key] || { weight: 0 };

    //   return {
    //     colorCode: purchaseItem.Color,
    //     colorQuality: purchaseItem.colorQuality,
    //     weight: purchaseItem.weight - salesItem.weight,
    //     denier: purchaseItem.denier,
    //   };
    // });
    const listOfOrders = [];
    const findMatchings = await matchingModel.find();
    for (const ele of findMatchings) {
      for (const data of pendingNewArr) {
        if (ele?.matchingId === data?.matchingId) {
          listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
        }
      }
    }

    const findFeeders = listOfOrders;
    const findColorYarn = await colorYarnModel.find();
    const findPickByDesign = await designModel.find();
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

    const findDesign = findPickByDesign.find((design) =>
      designArr.some((ele) => ele === design.name)
    );

    if (findDesign) {
      for (let i = 0; i < denierSet1.length; i++) {
        const ele = denierSet1[i];
        const result = ele.map((eleObj, index) => {
          const getMatchingId = findMatching.find(
            (element) => element.matchingId === eleObj.matchingId
          );
          if (getMatchingId && getMatchingId.name === findDesign.name) {
            const pickKey = `pick-${index + 1}`;
            const pickValue = findDesign.feeders[index]
              ? findDesign.feeders[index][pickKey]
              : null;
            const finalCut = findDesign.finalCut ? findDesign.finalCut : null;
            return { ...eleObj, pick: pickValue, finalCut: finalCut };
          } else {
            return eleObj;
          }
        });
        mergedObjects1.push(result);
      }
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
          findOrder?.pcsOnMachine,
          Number(data?.finalCut)
        );
      const calculatedObj = {
        ...data,
        weight: totalWeight,
      };
      resultArray.push(calculatedObj);
    }
    const newArray = resultArray.map((obj) => {
      const { denier, matchingId, pick, ...rest } = obj;
      return rest;
    });

    const mergedObjects = {};

    newArray.forEach((obj) => {
      const key = Object.values(obj)[0];
      if (mergedObjects[key]) {
        mergedObjects[key].weight += obj?.weight;
      } else {
        mergedObjects[key] = obj;
      }
    });

    let pageItems = Object.values(mergedObjects);
    pageItems = pageItems.map((obj) => {
      const keys = Object.keys(obj);
      const firstKey = keys[0];
      const updatedObj = {};
      const feederNumber = firstKey.replace(/f\d+/, "feeders");
      updatedObj[feederNumber] = obj[firstKey];
      keys.slice(1).forEach((key) => {
        updatedObj[key] = obj[key];
      });
      updatedObj["weight"] = parseFloat(obj["weight"].toFixed(4));
      return updatedObj;
    });
    for (const item of pageItems) {
      const { feeders, weight } = item;
      for (let detail of salesDetails) {
        if (detail.orderToken === tokenId && detail.colorCode === feeders) {
          detail.colorCode = feeders;
          detail.weight = weight;
          await detail.save();
        }
      }
    }
    return {
      status: 200,
      message: "Process order updated successfully.",
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

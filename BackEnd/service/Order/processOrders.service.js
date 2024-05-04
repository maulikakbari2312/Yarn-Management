const message = require("../../common/error.message");
const {
  findOrderByOrderId,
  findAllOrders,
} = require("../../DBQuery/Order/order");
const {
  findMachinePcs,
  findOrderPcsWorking,
  createPcsInProcess,
  findOrderPcsById,
  updatePcsOnMachine,
  findOrderByAllId,
} = require("../../DBQuery/Order/pcsOnMachine");
const { findAllMatchings } = require("../../DBQuery/Master/matching");
const { findAllSaleYarn } = require("../../DBQuery/Yarn/sales");
const { findDesigns } = require("../../DBQuery/Master/design");
const { findYarnColor } = require("../../DBQuery/Master/colorYarn");

exports.createProcessOrder = async (orderId, tokenId, data) => {
  try {
    const findByOrderId = await findOrderByOrderId(orderId);
    const findOrderOnMachine = await findMachinePcs();
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

          // if (findOrder.tokenId !== tokenId) {
          //   return {
          //     status: 404,
          //     message: "Another ground color order is inProcess.",
          //   };
          // }
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

    const findOrderInProcess = await findOrderPcsWorking(orderId, tokenId);

    if (!findOrderInProcess) {
      const createOrderDetail = await createPcsInProcess(
        data.machineNo,
        data.pcsOnMachine,
        orderId,
        tokenId
      );
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
    await YarnWeightCalculation(orderId);
    // const pendingOrderArr = [];
    // for (const order of findByOrderId?.orders) {
    //   pendingOrderArr.push(order);
    // }
    // const pendingNewArr = [];
    // for (const ele of pendingOrderArr) {
    //   if (ele.pcsOnMachine > 0) {
    //     pendingNewArr.push(ele);
    //   }
    // }

    // const findMatching = await matchingModel.find();

    // const salesDetails = await YarnSalesDetail.find();

    // const listOfOrders = [];
    // const findMatchings = await matchingModel.find();
    // for (const ele of findMatchings) {
    //   for (const data of pendingNewArr) {
    //     if (ele?.matchingId === data?.matchingId) {
    //       listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
    //     }
    //   }
    // }

    // const findFeeders = listOfOrders;
    // const findColorYarn = await colorYarnModel.find();
    // const findPickByDesign = await designModel.find();
    // const denierSet1 = [];

    // for (const feeder of findFeeders) {
    //   const denierSet = [];
    //   for (const [key, colorCode] of Object.entries(feeder)) {
    //     const matchingColorYarn = findColorYarn.find(
    //       (yarn) => yarn.colorCode === colorCode
    //     );
    //     if (matchingColorYarn) {
    //       const feederDenierInfo = {};
    //       feederDenierInfo[key] = colorCode;
    //       feederDenierInfo["denier"] = matchingColorYarn.denier;
    //       feederDenierInfo["matchingId"] = feeder.matchingId;
    //       denierSet.push(feederDenierInfo);
    //     }
    //   }
    //   if (denierSet.length > 0) {
    //     denierSet1.push(denierSet);
    //   }
    // }
    // let mergedObjects1 = [];
    // const designArr = [];
    // for (const data of pendingNewArr) {
    //   designArr.push(data.design);
    // }

    //   for (let i = 0; i < denierSet1.length; i++) {
    //     const ele = denierSet1[i];
    //     const result = ele.map((eleObj, index) => {
    //       const getMatchingId = findMatching.find(
    //         (element) => element.matchingId === eleObj.matchingId
    //       );
    //       const findOrderToken = pendingNewArr.find(
    //         (ele) => ele.matchingId === eleObj.matchingId
    //       );
    //       const findDesign = findPickByDesign.find((design) => design.name === getMatchingId.name);
    //       if (getMatchingId) {
    //         const pickKey = `pick-${index + 1}`;
    //         const pickValue = findDesign.feeders[index]
    //           ? findDesign.feeders[index][pickKey]
    //           : null;
    //         const finalCut = findDesign.finalCut ? findDesign.finalCut : null;
    //         const orderMatchingToken = findOrderToken.tokenId
    //           ? findOrderToken.tokenId
    //           : null;
    //         return {
    //           ...eleObj,
    //           pick: pickValue,
    //           finalCut: finalCut,
    //           orderMatchingToken: orderMatchingToken,
    //         };
    //       } else {
    //         return eleObj;
    //       }
    //     });
    //     mergedObjects1.push(result);
    //   }

    // mergedObjects1 = mergedObjects1
    //   .flatMap((arr) => (Array.isArray(arr) ? arr : [arr]))
    //   .filter((obj) => obj.hasOwnProperty("pick"));
    // const calculatYarnWeight = (denier, pick, order, finalCut) =>
    //   (denier * pick * order * finalCut * 52 * 1) / 9000000;
    // const resultArray = [];
    // for (const data of mergedObjects1) {
    //   const arrayWeight = 0;
    //   const findOrder = pendingNewArr.find(
    //     (order) => order.matchingId === data?.matchingId
    //   );
    //   const totalWeight =
    //     arrayWeight +
    //     calculatYarnWeight(
    //       Number(data?.denier),
    //       Number(data?.pick),
    //       findOrder.pcsOnMachine,
    //       Number(data?.finalCut)
    //     );
    //   const calculatedObj = {
    //     ...data,
    //     weight: totalWeight,
    //   };
    //   resultArray.push(calculatedObj);
    // }
    // console.log("===resultArray===", resultArray);

    // const pageItems = resultArray.map((obj) => {
    //   const keys = Object.keys(obj);
    //   const firstKey = keys[0];
    //   const feeders = firstKey.replace(/f\d+/, "feeders");
    //   const newObj = { [feeders]: obj[firstKey] };

    //   keys.slice(1).forEach((key) => {
    //     newObj[key] = obj[key];
    //   });

    //   return newObj;
    // });
    // console.log("==pageItems===", pageItems);
    // for (const item of pageItems) {
    //   const { feeders, weight, orderMatchingToken } = item;
    //   for (let detail of salesDetails) {
    //     if (
    //       detail.orderToken === orderMatchingToken &&
    //       detail.colorCode === feeders
    //     ) {
    //       detail.colorCode = feeders;
    //       detail.weight = weight;
    //       await detail.save();
    //     }
    //   }
    // }
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
    const findByOrderId = await findOrderByOrderId(orderId);

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
    const findOrders = await findAllOrders();
    const findOrderOnMachine = await findMachinePcs();

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
                orderNo: ele?.orderNo,
                date: ele?.date,
                party: ele?.party,
                design: ele?.design,
                machineNo: machineData?.machineNo,
                groundColor: ele?.groundColor,
                pcsOnMachine: machineData?.pcsOnMachine,
                tokenId: ele?.tokenId,
                orderId: order?.orderId,
                machineId: machineData?.machineId,
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
    const findOrders = await findOrderByOrderId(orderId);

    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    const findOrderOnMachine = await findOrderPcsById(orderId);

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

      await updatePcsOnMachine(filter, update);

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
    const pendingOrderArr = [];
    for (const order of findOrders?.orders) {
      pendingOrderArr.push(order);
    }
    const pendingNewArr = [];
    for (const ele of pendingOrderArr) {
      if (ele.pcsOnMachine >= 0) {
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
        (order) => order.tokenId === data.orderMatchingToken
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

    const accumulatedWeights = {};
    console.log("==pageItems===", pageItems);
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
    const findOrders = await findOrderByOrderId(orderId);
    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    const updatedOrder = findOrders.orders.find(
      (order) => order.tokenId === tokenId
    );

    const findOrderOnMachine = await findOrderByAllId(
      orderId,
      tokenId,
      machineId
    );

    if (!findOrderOnMachine) {
      return {
        status: 404,
        message: "Order with the specified machine ID not found.",
      };
    }

    const machineData = findOrderOnMachine.machinesInProcess.find(
      (machine) => machine.machineId === machineId
    );

    const findProcessOrderByToken = await findOrderPcsWorking(orderId, tokenId);

    let totalProcessOrder = 0;

    for (const item of findProcessOrderByToken.machinesInProcess) {
      totalProcessOrder += item.pcsOnMachine;
    }

    const anotherMachinePcs = totalProcessOrder - machineData.pcsOnMachine;
    const totalInProcess = anotherMachinePcs + updatedPcsOnMachine;
    if (totalInProcess > updatedOrder.pcs) {
      return {
        status: 422,
        message: `You are trying to add ${
          totalInProcess - updatedOrder.pcs
        } pieces more than total order.`,
      };
    }
    machineData.pcsOnMachine = updatedPcsOnMachine;
    await findOrderOnMachine.save();

    if (updatedOrder.pcs < updatedPcsOnMachine) {
      return {
        status: 422,
        message: `Your order is ${updatedOrder.pcs} pcs. If you want to add more order in process, please update the main order.`,
      };
    }

    let diffPcs = 0;
    if (updatedOrder.pcsOnMachine > totalInProcess) {
      diffPcs = updatedOrder.pcsOnMachine - totalInProcess;
      updatedOrder.pendingPcs = updatedOrder.pendingPcs + diffPcs;
      updatedOrder.pcsOnMachine = totalInProcess;
    } else {
      diffPcs = totalInProcess - updatedOrder.pcsOnMachine;
      updatedOrder.pendingPcs = updatedOrder.pendingPcs - diffPcs;
      updatedOrder.pcsOnMachine = totalInProcess;
    }

    await findOrders.save();
    await YarnWeightCalculation(orderId);
    // const pendingOrderArr = [];
    // for (const order of findOrders?.orders) {
    //   pendingOrderArr.push(order);
    // }
    // const pendingNewArr = [];
    // for (const ele of pendingOrderArr) {
    //   if (ele.pcsOnMachine > 0) {
    //     pendingNewArr.push(ele);
    //   }
    // }

    // const findMatching = await matchingModel.find();
    // const salesDetails = await YarnSalesDetail.find();

    // const listOfOrders = [];
    // const findMatchings = await matchingModel.find();
    // for (const ele of findMatchings) {
    //   for (const data of pendingNewArr) {
    //     if (ele?.matchingId === data?.matchingId) {
    //       listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
    //     }
    //   }
    // }

    // const findFeeders = listOfOrders;
    // const findColorYarn = await colorYarnModel.find();
    // const findPickByDesign = await designModel.find();
    // const denierSet1 = [];

    // for (const feeder of findFeeders) {
    //   const denierSet = [];
    //   for (const [key, colorCode] of Object.entries(feeder)) {
    //     const matchingColorYarn = findColorYarn.find(
    //       (yarn) => yarn.colorCode === colorCode
    //     );
    //     if (matchingColorYarn) {
    //       const feederDenierInfo = {};
    //       feederDenierInfo[key] = colorCode;
    //       feederDenierInfo["denier"] = matchingColorYarn.denier;
    //       feederDenierInfo["matchingId"] = feeder.matchingId;
    //       denierSet.push(feederDenierInfo);
    //     }
    //   }
    //   if (denierSet.length > 0) {
    //     denierSet1.push(denierSet);
    //   }
    // }
    // let mergedObjects1 = [];
    // const designArr = [];
    // for (const data of pendingNewArr) {
    //   designArr.push(data.design);
    // }

    //   for (let i = 0; i < denierSet1.length; i++) {
    //     const ele = denierSet1[i];
    //     const result = ele.map((eleObj, index) => {
    //       const getMatchingId = findMatching.find(
    //         (element) => element.matchingId === eleObj.matchingId
    //       );
    //       const findOrderToken = pendingNewArr.find(
    //         (ele) => ele.matchingId === eleObj.matchingId
    //       );
    //       const findDesign = findPickByDesign.find((design) =>design.name === getMatchingId.name);
    //       if (getMatchingId) {
    //         const pickKey = `pick-${index + 1}`;
    //         const pickValue = findDesign.feeders[index]
    //           ? findDesign.feeders[index][pickKey]
    //           : null;
    //         const finalCut = findDesign.finalCut ? findDesign.finalCut : null;
    //         const orderMatchingToken = findOrderToken.tokenId
    //         ? findOrderToken.tokenId
    //         : null;
    //       return {
    //         ...eleObj,
    //         pick: pickValue,
    //         finalCut: finalCut,
    //         orderMatchingToken: orderMatchingToken,
    //       };
    //       } else {
    //         return eleObj;
    //       }
    //     });
    //     mergedObjects1.push(result);
    //   }

    // mergedObjects1 = mergedObjects1
    //   .flatMap((arr) => (Array.isArray(arr) ? arr : [arr]))
    //   .filter((obj) => obj.hasOwnProperty("pick"));

    // const calculatYarnWeight = (denier, pick, order, finalCut) =>
    //   (denier * pick * order * finalCut * 52 * 1) / 9000000;
    // const resultArray = [];
    // for (const data of mergedObjects1) {
    //   const arrayWeight = 0;
    //   const findOrder = pendingNewArr.find(
    //     (order) => order.matchingId === data?.matchingId
    //   );
    //   const totalWeight =
    //     arrayWeight +
    //     calculatYarnWeight(
    //       Number(data?.denier),
    //       Number(data?.pick),
    //       Number(findOrder.pcsOnMachine) + Number(findOrder.completePcs) + Number(findOrder.dispatch) + Number(findOrder.settlePcs),
    //       Number(data?.finalCut)
    //     );
    //   const calculatedObj = {
    //     ...data,
    //     weight: totalWeight,
    //   };
    //   resultArray.push(calculatedObj);
    // }

    // const pageItems = resultArray.map((obj) => {
    //   const keys = Object.keys(obj);
    //   const firstKey = keys[0];
    //   const feeders = firstKey.replace(/f\d+/, "feeders");
    //   const newObj = { [feeders]: obj[firstKey] };

    //   keys.slice(1).forEach((key) => {
    //     newObj[key] = obj[key];
    //   });

    //   return newObj;
    // });
    // console.log("==pageItems===", pageItems);

    // for (const item of pageItems) {
    //   const { feeders, weight, orderMatchingToken } = item;
    //   for (let detail of salesDetails) {
    //     if (detail.orderToken === orderMatchingToken && detail.colorCode === feeders) {
    //       detail.colorCode = feeders;
    //       detail.weight = weight;
    //       await detail.save();
    //     }
    //   }
    // }
    return {
      status: 200,
      message: "Process order updated successfully.",
    };
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
  // console.log("==pageItems===", pageItems);
  // for (const item of pageItems) {
  //   const { feeders, weight, orderMatchingToken } = item;
  //   for (let detail of salesDetails) {
  //     if (
  //       detail.orderToken === orderMatchingToken &&
  //       detail.colorCode === feeders
  //     ) {
  //       detail.colorCode = feeders;
  //       detail.weight += weight;
  //       await detail.save();
  //     }
  //   }
  // }

  const accumulatedWeights = {};
  console.log("==pageItems===", pageItems);
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

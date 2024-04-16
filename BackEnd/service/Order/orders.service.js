const message = require("../../common/error.message");
const ordersModel = require("../../model/Order/orders.model");
const orderIdModel = require("../../model/Order/orderId.model");
const matchingDetail = require("../../model/Master/matching.model");
const designModel = require("../../model/Master/design.model");
const pcsOnMachineModel = require("../../model/Order/pcsOnMachine.model");
const matchingModel = require("../../model/Master/matching.model");
const colorYarnModel = require("../../model/Master/colorYarn.model");
const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");
const yarnSalesModel = require("../../model/Yarn/yarnSales.model");
const moment = require("moment");
const { findYarnColor } = require("../../DBQuery/Master/colorYarn");

exports.createOrderId = async () => {
  try {
    const createOrderIdDetail = new orderIdModel();
    const detail = await createOrderIdDetail.save();

    return {
      status: 200,
      message: message.ORDERID_CREATED,
      data: detail,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.createOrders = async (data, orderId) => {
  try {
    const sixDigitNumber = hashCode(orderId);
    const matchingDetails = await matchingDetail.findOne({
      matchingId: data.matchingId,
    });
    const orderDetail = createOrderDetail(
      data,
      sixDigitNumber,
      matchingDetails
    );

    const findOrder = await ordersModel.findOne({ orderId: orderId });

    if (!findOrder) {
      return createNewOrder(data, orderId, orderDetail, sixDigitNumber);
    } else {
      return updateExistingOrder(data, orderDetail, findOrder, sixDigitNumber);
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return Math.abs(hash) % 1000000;
}

function createOrderDetail(data, sixDigitNumber, matchingDetails) {
  return {
    party: data?.party,
    design: data?.design,
    date: moment(data?.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
    rate: data?.rate,
    groundColor: data?.groundColor,
    pallu: matchingDetails?.pallu,
    pcs: data?.pcs,
    pendingPcs: data?.pcs,
    orderNo: sixDigitNumber,
    matchingId: data?.matchingId,
  };
}

async function createNewOrder(data, orderId, orderDetail, sixDigitNumber) {
  try {
    const createOrderDetail = new ordersModel({
      orders: [orderDetail],
      orderId: orderId,
    });
    const detail = await createOrderDetail.save();
    const findOrderById = await ordersModel.find({ orderId: orderId });
    for (const ele of detail?.orders) {
      const findMyOrder = findOrderById[0].orders.find(
        (item) => item?.tokenId === ele?.tokenId
      );
      const { pageItems, pendingOrderYarn } = await processOrderDetail(
        data,
        orderDetail,
        sixDigitNumber,
        ele?.tokenId,
        findMyOrder
      );
      return {
        status: 200,
        message: "Order Created Successfully",
        data: detail,
        pageItems,
        pendingOrderYarn,
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

async function updateExistingOrder(
  data,
  orderDetail,
  findOrder,
  sixDigitNumber
) {
  try {
    if (
      findOrder.orders[0]?.party === orderDetail.party &&
      findOrder.orders[0]?.date === orderDetail.date
    ) {
      findOrder.orders.push(orderDetail);
      const detail = await findOrder.save();

      const latestOrderIndex = detail.orders.length - 1;
      const latestOrder = detail.orders[latestOrderIndex];
      for (const ele of detail?.orders) {
        const { pageItems, pendingOrderYarn } = await processOrderDetail(
          data,
          orderDetail,
          sixDigitNumber,
          latestOrder?.tokenId,
          latestOrder
        );

        return {
          status: 200,
          message: "Order Updated Successfully",
          data: detail,
          pageItems,
          pendingOrderYarn,
        };
      }
    } else {
      return {
        status: 400,
        message: "You cannot change party, design, date, and rate.",
      };
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}

exports.findMatchingFeeder = async (orderId) => {
  try {
    const order = await ordersModel.findOne({ orderId: orderId });
    if (!order) {
      return {
        status: 404,
        message: "Order not found",
      };
    }
    const matchingDetails = await matchingDetail.find();

    const findDesign1 = order.orders[0].design;
    const designData = await designModel.findOne({ name: findDesign1 });
    if (!matchingDetails || !matchingDetails.length) {
      return {
        status: 404,
        message: message.MATCHING_NOT_FOUND,
      };
    }

    const matchingFeeders = matchingDetails
      .filter((matching) =>
        order.orders.some((data) => matching.name === data.design)
      )
      .map((matching) => ({
        ...matching?.feeders,
        matchingId: matching?.matchingId,
        design: matching?.name,
      }));

    const result = removeDuplicateObjects(matchingFeeders);
    function removeDuplicateObjects(matchingFeeders) {
      const uniqueObjects = new Set(
        matchingFeeders.map((obj) => JSON.stringify(obj))
      );
      const resultArray = Array.from(uniqueObjects, JSON.parse);
      return resultArray;
    }
    console.log("==result===", result);
    const pendingOrderArr = [];

    for (const ele of order?.orders) {
      if (order.orderId === orderId) {
        pendingOrderArr.push(ele);
      }
    }

    const listOfOrders = [];

    const findMatching = await matchingModel.find();

    for (const ele of findMatching) {
      for (const data of pendingOrderArr) {
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

    for (const data of result) {
      let findDesign = findPickByDesign.find((ele) => ele.name === data.design);

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
      } else {
        console.error(`Design "${data.design}" not found in findPickByDesign`);
      }
      //   mergedObjects1 = mergedObjects1
      //     .flatMap((arr) => (Array.isArray(arr) ? arr : [arr]))
      //     .filter((obj) => obj.hasOwnProperty("pick"));
      mergedObjects1 = Array.from(
        new Set(mergedObjects1.map(JSON.stringify)),
        JSON.parse
      );
    }

    let totalWeight = 0;
    const resultArray = [];
    const newArray = resultArray.map((obj) => {
      const { denier, matchingId, pick, ...rest } = obj;
      return rest;
    });

    const calculateSareeWeight = (denier, pick, finalCut) =>
      (denier * pick * finalCut * 52 * 1) / 9000000;

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
    console.log("==pageItems===", pageItems);
    const obj = {};
    for (const arr of mergedObjects1) {
      for (const data of arr) {
        const totalSareeWeight = calculateSareeWeight(
          Number(data?.denier),
          Number(data?.pick),
          Number(data?.finalCut)
        );
        if (!obj[data.matchingId]) {
          obj[data.matchingId] = 0;
        }
        obj[data.matchingId] += totalSareeWeight;
      }
    }
    const matchingSareeWeight = obj;
    const matchingArra = [];
    for (const [key, value] of Object.entries(matchingSareeWeight)) {
      for (const ele of result) {
        if (ele.matchingId === key.toString()) {
          const match = {
            ...ele,
            weight: value.toFixed(4),
          };
          matchingArra.push(match);
        }
      }
    }
    const responce = {
      status: 200,
      message: message.MATCHING_FEEDER_SUCCESS,
      ground: designData.ground,
      pallu: designData.pallu,
      pageItems: matchingArra,
    };
    return responce;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.findOrderById = async () => {
  try {
    const findOrder = await ordersModel.find();
    const matchingDetails = await matchingDetail.find();

    const final = findOrder.map((ele) => {
      const sumPcsByDesign = ele.orders.reduce((accumulator, order) => {
        let { pcs } = order;
        accumulator += pcs;
        return accumulator;
      }, 0);

      const sumPendingPcsByDesign = ele.orders.reduce((accumulator, order) => {
        let { pendingPcs } = order;
        accumulator += pendingPcs;
        return accumulator;
      }, 0);

      const sumProcessPcsByDesign = ele.orders.reduce((accumulator, order) => {
        let { pcsOnMachine } = order;
        accumulator += pcsOnMachine;
        return accumulator;
      }, 0);

      const sumCompletedPcsByDesign = ele.orders.reduce(
        (accumulator, order) => {
          let { completePcs } = order;
          accumulator += completePcs;
          return accumulator;
        },
        0
      );

      const sumDispatchPcsByDesign = ele.orders.reduce((accumulator, order) => {
        let { dispatch } = order;
        accumulator += dispatch;
        return accumulator;
      }, 0);

      ////////////////////matching//////////////////////////////////////////////////////////////

      if (!matchingDetails || !matchingDetails.length) {
        return {
          status: 404,
          message: message.MATCHING_NOT_FOUND,
        };
      }

      const matchingFeeders = matchingDetails
        .filter((matching) =>
          ele.orders.some(
            (data) =>
              matching.name.includes(data.design) &&
              matching.name === data.design
          )
        )
        .map((matching) => matching.feeders);

      const result = removeDuplicateObjects(matchingFeeders);
      function removeDuplicateObjects(matchingFeeders) {
        const uniqueObjects = new Set(
          matchingFeeders.map((obj) => JSON.stringify(obj))
        );
        const resultArray = Array.from(uniqueObjects, JSON.parse);
        return resultArray;
      }
      return {
        _id: ele._id,
        party: ele.orders[0]?.party,
        design: ele.orders[0]?.design,
        matching: `matchings`,
        date: ele.orders[0]?.date,
        rate: ele.orders[0]?.rate,
        orderNo: ele.orders[0]?.orderNo,
        orders: ele.orders,
        total: sumPcsByDesign,
        pending: sumPendingPcsByDesign,
        process: sumProcessPcsByDesign,
        completed: sumCompletedPcsByDesign,
        dispatch: sumDispatchPcsByDesign,
        orderId: ele.orderId,
        __v: ele.__v,
      };
    });

    return final;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.findOrders = async (orderId) => {
  try {
    const findOrder = await ordersModel.findOne({ orderId: orderId });

    if (!findOrder) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const firstOrder = findOrder?.orders[0];

    const sumPcsByDesign = findOrder.orders.reduce((accumulator, order) => {
      let { pcs } = order;
      accumulator += pcs;
      return accumulator;
    }, 0);

    const sumPendingPcsByDesign = findOrder.orders.reduce(
      (accumulator, order) => {
        let { pendingPcs } = order;
        accumulator += pendingPcs;
        return accumulator;
      },
      0
    );

    const response = {
      party: firstOrder?.party,
      design: firstOrder?.design,
      date: firstOrder?.date,
      orders: findOrder?.orders,
      rate: firstOrder?.rate,
    };

    return {
      status: 200,
      message: message.ORDER_FIND_SUCCESSFULLY,
      pageItems: response,
      totalPcs: sumPcsByDesign,
      pendingPcs: sumPendingPcsByDesign,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.editOrdersDetail = async (data, orderId, tokenId) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });

    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    let findOrder = findOrders.orders.find(
      (order) => order?.tokenId === tokenId
    );

    if (data.pcs >= findOrder.pcs) {
      const extraPcs = data.pcs - findOrder.pcs;
      findOrder.pendingPcs = findOrder.pendingPcs + extraPcs;
    }

    if (data.pcs < findOrder.pcs) {
      const totalInProcessOrders =
        findOrder.completePcs + findOrder.dispatch + findOrder.pcsOnMachine;
      if (data.pcs < totalInProcessOrders) {
        return {
          status: 404,
          message: `Already ${totalInProcessOrders} orders are InProcess.`,
        };
      }
      const reduceDiff = findOrder.pcs - data.pcs;
      findOrder.pendingPcs = findOrder.pendingPcs - reduceDiff;
    }

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        findOrder[key] = data[key];
      }
    }

    const updatedOrder = await findOrders.save();
    await editProcessOrderDetail(data, tokenId, findOrder);

    return {
      status: 200,
      message: message.ORDER_UPDATED,
      data: updatedOrder,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteOrder = async (orderId, tokenId) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });
    if (!findOrders) {
      return {
        status: 404,
        message: message.ORDER_NOT_FOUND,
      };
    }

    for (const ele of findOrders?.orders) {
      if (ele?.pcs !== ele?.pendingPcs) {
        return {
          status: 422,
          message:
            "Order already in process. You cannot delete this order. you can edit it.",
        };
      }
    }

    const updatedOrders = findOrders.orders.filter(
      (ele) => ele.tokenId !== tokenId
    );

    findOrders.orders = updatedOrders;
    await findOrders.save();

    await yarnSalesModel.deleteMany({ orderToken: tokenId });

    // await pcsOnMachineModel.deleteMany({
    //   tokenId: tokenId,
    // });
    return {
      status: 200,
      message: message.ORDERD_DELETE,
      data: findOrders,
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteWholeOrder = async (orderId) => {
  try {
    const findOrders = await ordersModel.findOne({ orderId: orderId });
    for (const ele of findOrders?.orders) {
      if (ele?.pcs !== ele?.pendingPcs) {
        return {
          status: 422,
          message:
            "Order already in process. You cannot delete this order. you can edit it.",
        };
      }
      await yarnSalesModel.deleteMany({ orderToken: ele?.tokenId });
    }

    const deleteOrder = await ordersModel.deleteOne({
      orderId: orderId,
    });

    if (!deleteOrder) {
      return {
        status: 404,
        message: "Order is not found",
      };
    }
    // const deletepcsOnMachine = await pcsOnMachineModel.deleteMany({
    //   orderId: orderId,
    // });

    // if (!deletepcsOnMachine) {
    //   return {
    //     status: 404,
    //     message: "Order In Process is not found",
    //   };
    // }

    return {
      status: 200,
      message: message.ORDER_DELETE,
      data: deleteOrder,
    };
  } catch (error) {
    console.error("Error deleting order:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.totalMatching = async (orderId) => {
  try {
    const order = await ordersModel.findOne({ orderId: orderId });

    const result = removeDuplicateObjects(order.orders);
    function removeDuplicateObjects(matchingFeeders) {
      const uniqueObjects = new Set(
        matchingFeeders.map((obj) => JSON.stringify(obj?.matchingId))
      );
      const resultArray = Array.from(uniqueObjects, JSON.parse);
      return resultArray;
    }
    const status = result.length === 1 ? "Matching" : "Matchings";
    return {
      status: 200,
      message: `Total ${result.length} ${status} Find Successfully.`,
      pageItems: result,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.findMatching = async (design) => {
  try {
    const getMatchingData = await matchingModel.find();

    const groundColorArr = [];
    for (let ele of getMatchingData) {
      if (ele.name === design) {
        groundColorArr.push(ele);
      }
    }

    if (!groundColorArr.length) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }
    const matchingFeeders = groundColorArr.map((matching) => ({
      ...matching?.feeders,
      matchingId: matching?.matchingId,
    }));

    const uniqGroundColor = [...new Set(matchingFeeders)];
    return uniqGroundColor;
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

async function processOrderDetail(
  data,
  orderDetail,
  sixDigitNumber,
  tokenId,
  findMyOrder
) {
  try {
    const findMatching = await matchingModel.find();
    let colorYarn = [];
    for (const ele of findMatching) {
      if (ele.matchingId === data.matchingId) {
        colorYarn.push(ele.feeders);
      }
    }
    const uniqueValues = new Set();

    colorYarn.forEach((obj) => {
      Object.values(obj).forEach((value) => {
        uniqueValues.add(value);
      });
    });

    const purchaseDetails = await yarnPurchaseModel.find();
    const salesDetails = await yarnSalesModel.find();

    const purchaseAggregationMap = purchaseDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: detail.denier };
      }

      map[key].weight += detail.weight;
      return map;
    }, {});
    const purchaseResult = Object.entries(purchaseAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          Color: colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const salesAggregationMap = salesDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: detail.denier };
      }

      map[key].weight += detail.weight;

      return map;
    }, {});
    const salesResult = Object.entries(salesAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          Color: colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const purchaseDictionary = purchaseResult.reduce((dict, item) => {
      const key = `${item.Color}-${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});
    const salesDictionary = salesResult.reduce((dict, item) => {
      const key = `${item.Color}-${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});

    const yarnStock = Object.keys(purchaseDictionary).map((key) => {
      const purchaseItem = purchaseDictionary[key] || { weight: 0 };
      const salesItem = salesDictionary[key] || { weight: 0 };

      return {
        colorCode: purchaseItem.Color,
        colorQuality: purchaseItem.colorQuality,
        weight: purchaseItem.weight - salesItem.weight,
        denier: purchaseItem.denier,
      };
    });

    const listOfOrders = [];
    const findMatchings = await matchingModel.find();
    for (const ele of findMatchings) {
      if (ele?.matchingId === data?.matchingId) {
        listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
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

    const findDesign = findPickByDesign.find(
      (design) => design.name === data.design
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
    } else {
      console.error(`Design "${data.design}" not found in findPickByDesign`);
    }

    mergedObjects1 = mergedObjects1.flatMap((arr) =>
      arr.filter((obj) => obj.hasOwnProperty("pick"))
    );

    const calculatYarnWeight = (denier, pick, order, finalCut) =>
      (denier * pick * order * finalCut * 52 * 1) / 9000000;

    const resultArray = [];
    for (const item of mergedObjects1) {
      const arrayWeight = 0;
      const totalWeight =
        arrayWeight +
        calculatYarnWeight(
          Number(item?.denier),
          Number(item?.pick),
          findMyOrder?.pcsOnMachine,
          Number(item?.finalCut)
        );
      const calculatedObj = {
        ...item,
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
    let pendingOrderYarn = [];
    for (const item of pageItems) {
      let colorFound = false;
      for (const ele of yarnStock) {
        if (item.feeders === ele.colorCode) {
          colorFound = true;
          const yarnSalesData = {
            invoiceNo: sixDigitNumber,
            lotNo: sixDigitNumber,
            party: data.party,
            colorCode: ele.colorCode,
            colorQuality: ele.colorQuality,
            date: moment().format("DD/MM/YYYY"),
            weight: item.weight,
            denier: ele.denier,
            price: 0,
            orderToken: tokenId,
          };
          const createYarnSalesDetail = new yarnSalesModel(yarnSalesData);
          await createYarnSalesDetail.save();
        }
      }
      if (!colorFound) {
        const getYarnPurchase = await yarnPurchaseModel.find();
        const getColorYarn = await findYarnColor();
        const findColorYarn = getColorYarn.find(
          (ele) => ele.colorCode === `${item.feeders}`
        );
        for (const data of getYarnPurchase) {
          if (data.colorCode !== item.feeders) {
            const yarnPurchaseData = {
              invoiceNo: "ABCD",
              lotNo: "ABCD",
              party: "ABCD",
              colorCode: `${item.feeders}`,
              colorQuality: findColorYarn.colorQuality
                ? findColorYarn.colorQuality
                : "ABCD",
              date: moment().format("DD/MM/YYYY"),
              weight: 0,
              denier: 0,
            };
            const createYarnPurchaseDetail = new yarnPurchaseModel(
              yarnPurchaseData
            );
            await createYarnPurchaseDetail.save();
            const yarnSalesData = {
              invoiceNo: sixDigitNumber,
              lotNo: sixDigitNumber,
              party: data.party,
              colorCode: `${item.feeders}`,
              colorQuality: findColorYarn.colorQuality
              ? findColorYarn.colorQuality
              : "ABCD",
              date: moment().format("DD/MM/YYYY"),
              weight: item.weight,
              denier: 0,
              price: 0,
              orderToken: tokenId,
            };
            const createYarnSalesDetail = new yarnSalesModel(yarnSalesData);
            await createYarnSalesDetail.save();
          }
        }
      }
    }
    return { pageItems, pendingOrderYarn };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

async function editProcessOrderDetail(data, tokenId, findOrder) {
  try {
    // const findMatching = await matchingModel.find();
    // let colorYarn = [];
    // for (const ele of findMatching) {
    //   if (ele.matchingId === data.matchingId) {
    //     colorYarn.push(ele.feeders);
    //   }
    // }
    // const uniqueValues = new Set();

    // colorYarn.forEach((obj) => {
    //   Object.values(obj).forEach((value) => {
    //     uniqueValues.add(value);
    //   });
    // });

    // const purchaseDetails = await yarnPurchaseModel.find();
    const salesDetails = await yarnSalesModel.find();

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
      if (ele?.matchingId === data?.matchingId) {
        listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
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

    let findDesign = findPickByDesign.find((ele) => ele.name === data?.design);
    let mergedObjects1 = [];
    if (findDesign) {
      for (let i = 0; i < denierSet1.length; i++) {
        const ele = denierSet1[i];
        const result = ele.map((eleObj, index) => {
          const getMatchingId = findMatchings.find(
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
    } else {
      console.error(`Design "${data?.design}" not found in findPickByDesign`);
    }

    mergedObjects1 = mergedObjects1.flatMap((arr) =>
      arr.filter((obj) => obj.hasOwnProperty("pick"))
    );
    const calculatYarnWeight = (denier, pick, order, finalCut) =>
      (denier * pick * order * finalCut * 52 * 1) / 9000000;
    const resultArray = [];
    for (const item of mergedObjects1) {
      const arrayWeight = 0;
      const totalWeight =
        arrayWeight +
        calculatYarnWeight(
          Number(item?.denier),
          Number(item?.pick),
          findOrder?.pcsOnMachine,
          Number(item?.finalCut)
        );
      const calculatedObj = {
        ...item,
        weight: Number(totalWeight),
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
    let pendingOrderYarn = [];
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

    return { pageItems, pendingOrderYarn };
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

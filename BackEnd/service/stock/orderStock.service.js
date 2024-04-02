const ordersModel = require("../../model/Order/orders.model");
const matchingModel = require("../../model/Master/matching.model");
const message = require("../../common/error.message");
const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");
const yarnSalesModel = require("../../model/Yarn/yarnSales.model");
const designModel = require("../../model/Master/design.model");
const colorYarnModel = require("../../model/Master/colorYarn.model");

exports.getOrderStock = async () => {
  try {
    const findOrders = await ordersModel.find();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const pendingOrderArr = [];
    for (const order of findOrders) {
      for (const ele of order.orders) {
        pendingOrderArr.push(ele);
      }
    }
    const newArr = [];
    for (const ele of pendingOrderArr) {
      if (ele.pendingPcs > 0) {
        newArr.push(ele);
      }
    }

    const matchingId = new Set(newArr.map((ele) => ele.matchingId));
    const resultArray = Array.from(matchingId);

    const findMatching = await matchingModel.find();

    let colorYarn = [];
    for (const ele of findMatching) {
      for (const matching of resultArray) {
        if (ele.matchingId === matching) {
          colorYarn.push(ele.feeders);
        }
      }
    }
    const uniqueValues = new Set();

    colorYarn.forEach((obj) => {
      Object.values(obj).forEach((value) => {
        uniqueValues.add(value);
      });
    });

    const uniqueArray = [...uniqueValues];

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
    const result = uniqueArray.map((color) => {
      const stockItem = yarnStock.find((item) => item.colorCode === color);
      const weight = stockItem ? stockItem.weight : 0;
      return { color, weight };
    });
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getListOfOrders = async () => {
  try {
    const findOrders = await ordersModel.find();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const listOfOrders = new Set();

    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.pendingPcs > 0) {
          listOfOrders.add(ele.orderNo);
        }
      }
    }
    return Array.from(listOfOrders);

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getListOfOrderDesign = async (orderNo) => {
  try {
    const findOrders = await ordersModel.find();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }

    const listOfDesign = new Set();
    for (const order of findOrders) {
      for (const ele of order.orders) {
        if (ele.orderNo === orderNo) {
          listOfDesign.add(ele.design);
        }
      }
    }
    return Array.from(listOfDesign);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

exports.getsareeYarn = async (orderNo, design) => {
  try {
    const findOrders = await ordersModel.find();
    if (!findOrders) {
      return {
        status: 404,
        message: "Order not found",
      };
    }
    const pendingOrderArr = [];
    for (const order of findOrders) {
      for (const ele of order?.orders) {
        if (ele.orderNo === orderNo) {
          pendingOrderArr.push(ele);
        }
      }
    }

    const listOfOrders = [];

    const findMatching = await matchingModel.find();

    for (const ele of findMatching) {
      for (const data of pendingOrderArr) {
        if (ele?.name === design && ele?.matchingId === data?.matchingId) {
          listOfOrders.push({ ...ele?.feeders, matchingId: ele?.matchingId });
        }
      }
    }

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
    let findDesign = findPickByDesign.find((ele) => ele.name === design);

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
              return { ...eleObj, pick: pickValue };
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

    const calculatYarnWeight = (denier, pick, order) =>
      (denier * pick * order * 52 * 1) / 9000000;

    let totalWeight = 0;
    const resultArray = [];
    for (const data of mergedObjects1) {
      const arrayWeight = 0;
        const findOrder = pendingOrderArr.find(
          (order) => order.matchingId === data?.matchingId
        );
        const totalYarnWeight = arrayWeight + calculatYarnWeight(
          Number(data?.denier),
          Number(data?.pick),
          findOrder.pendingPcs
        );
        const calculatedObj = {
          ...data,
          weight: totalYarnWeight,
        };
        resultArray.push(calculatedObj);
    }
    const newArray = resultArray.map((obj) => {
      const { denier, matchingId, pick, ...rest } = obj;
      return rest;
    });

    const calculateSareeWeight = (denier, pick) =>
      (denier * pick * 52 * 1) / 9000000;

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
    for (const data of pageItems) {
      for (const ele of yarnStock) {
        const colorKey = Object.keys(data)[0]; 
        const colorCode = data[colorKey]; 
          if (colorCode === ele.colorCode) {
            const remainYarn = {
              color: ele.colorCode,
              totalStock: ele.weight,
              requiredYarn: data.weight,
              // remainingStock: ele.weight - data.weight,
            };

            remainYarn.totalStock = remainYarn.totalStock.toFixed(4);
            remainYarn.requiredYarn = remainYarn.requiredYarn.toFixed(4);
            // remainYarn.remainingStock = remainYarn.remainingStock.toFixed(4);
            pendingOrderYarn.push(remainYarn);
          }
      }
    }
    const uniqueYarn = Array.from(new Set(pendingOrderYarn.map(JSON.stringify))).map(JSON.parse);

  
    const obj = {};
    for (const data of mergedObjects1) {
      const arrayWeight = 0;
        const totalSareeWeight = arrayWeight + calculateSareeWeight(
          Number(data?.denier),
          Number(data?.pick)
        );
        totalWeight += totalSareeWeight;
        obj[data?.matchingId] = totalWeight;
    }
    const matchingSareeWeight = obj;
    return {
      pageItems: uniqueYarn,
      matchingSareeWeight,
    };
  }
 
   catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const message = require("../../common/error.message");
const yarnSalesModel = require("../../model/Yarn/yarnSales.model");
const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");
var moment = require("moment");
const YarnPartySalesDetail = require("../../model/Yarn/yarnPartySales");

exports.createYarnSales = async (yarnSales) => {
  try {
    const salesDetails = await yarnSalesModel.find();
    const purchaseDetails = await yarnPurchaseModel.find();

    for (const ele of salesDetails) {
      if (ele.invoiceNo === yarnSales.invoiceNo) {
        return {
          status: 400,
          message: "yarnSales invoiceNo cannot be same!",
        };
      } else if (ele.lotNo === yarnSales.lotNo) {
        return {
          status: 400,
          message: "yarnSales lotNo cannot be same!",
        };
      }
    }
    const purchaseAggregationMap = purchaseDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: 0 };
      }

      map[key].weight += detail.weight;
      // map[key].denier += detail.denier;

      return map;
    }, {});
    const purchaseResult = Object.entries(purchaseAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const salesAggregationMap = salesDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: 0 };
      }

      map[key].weight += detail.weight;
      // map[key].denier += detail.denier;

      return map;
    }, {});
    const salesResult = Object.entries(salesAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const purchaseDictionary = purchaseResult.reduce((dict, item) => {
      const key = `${item.colorCode}:${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});

    const salesDictionary = salesResult.reduce((dict, item) => {
      const key = `${item.colorCode}:${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});

    const result = Object.keys(purchaseDictionary).map((key) => {
      const purchaseItem = purchaseDictionary[key] || { weight: 0, denier: 0 };
      const salesItem = salesDictionary[key] || { weight: 0, denier: 0 };

      return {
        colorCode: purchaseItem.colorCode,
        colorQuality: purchaseItem.colorQuality,
        weight: purchaseItem.weight - salesItem.weight,
        denier: purchaseItem.denier - salesItem.denier,
      };
    });

    for (const ele of result) {
      if (
        ele.colorCode === yarnSales.colorCode &&
        ele.colorQuality === yarnSales.colorQuality
      ) {
        if (ele.weight < yarnSales.weight) {
          return {
            status: 400,
            message: message.WEIGHT_DIFFERENCE,
          };
        }
      }
    }

    const yarnSalesData = {
      invoiceNo: yarnSales.invoiceNo,
      lotNo: yarnSales.lotNo,
      saleParty: yarnSales.saleParty,
      buyParty: yarnSales.buyParty,
      colorCode: yarnSales.colorCode,
      colorQuality: yarnSales.colorQuality,
      date: moment(yarnSales.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
      weight: yarnSales.weight,
      denier: yarnSales.denier,
      price: yarnSales.price,
    };
    const createYarnSalesDetail = new yarnSalesModel(yarnSalesData);
    const detail = await createYarnSalesDetail.save();

    yarnSalesData["tokenId"] = createYarnSalesDetail.tokenId;
    const createYarnPartySalesDetail = new YarnPartySalesDetail(yarnSalesData);
    await createYarnPartySalesDetail.save();

    return {
      status: 200,
      message: message.YARN_SALES_CREATED,
      data: detail,
    };
  } catch (error) {
    console.log("==error=", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findYarnSales = async () => {
  try {
    const salesDetails = await YarnPartySalesDetail.find();
    if (!salesDetails) {
      return {
        status: 404,
        message: message.YARNSALES_NOT_FOUND,
      };
    }
    return salesDetails;
  } catch (error) {
    throw error;
  }
};

exports.editYarnSalesDetail = async (data, token) => {
  try {
    const salesDetails = await yarnSalesModel.find();
    const purchaseDetails = await yarnPurchaseModel.find();

    // const existingSalesInvoice = await yarnSalesModel.findOne({
    //   invoiceNo: data.invoiceNo,
    // });

    // if (existingSalesInvoice && existingSalesInvoice.tokenId !== token) {
    //   return {
    //     status: 400,
    //     message: "YarnSales invoiceNo cannot be the same!",
    //   };
    // }

    // const existingSalesLotNo = await yarnSalesModel.findOne({
    //   lotNo: data.lotNo,
    // });

    // if (existingSalesLotNo && existingSalesLotNo.tokenId !== token) {
    //   return {
    //     status: 400,
    //     message: "YarnSales lotNo cannot be the same!",
    //   };
    // }

    const purchaseAggregationMap = purchaseDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: 0 };
      }

      map[key].weight += detail.weight;
      map[key].denier += detail.denier;

      return map;
    }, {});
    const purchaseResult = Object.entries(purchaseAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const salesAggregationMap = salesDetails.reduce((map, detail) => {
      const key = `${detail.colorCode}:${detail.colorQuality}`;
      if (!map[key]) {
        map[key] = { weight: 0, denier: 0 };
      }

      map[key].weight += detail.weight;
      map[key].denier += detail.denier;

      return map;
    }, {});
    const salesResult = Object.entries(salesAggregationMap).map(
      ([key, values]) => {
        const [colorCode, colorQuality] = key.split(":");
        return {
          colorCode,
          colorQuality,
          weight: values.weight,
          denier: values.denier,
        };
      }
    );

    const purchaseDictionary = purchaseResult.reduce((dict, item) => {
      const key = `${item.colorCode}:${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});

    const salesDictionary = salesResult.reduce((dict, item) => {
      const key = `${item.colorCode}:${item.colorQuality}`;
      dict[key] = item;
      return dict;
    }, {});

    const result = Object.keys(purchaseDictionary).map((key) => {
      const purchaseItem = purchaseDictionary[key] || { weight: 0, denier: 0 };
      const salesItem = salesDictionary[key] || { weight: 0, denier: 0 };

      return {
        colorCode: purchaseItem.colorCode,
        colorQuality: purchaseItem.colorQuality,
        weight: purchaseItem.weight - salesItem.weight,
        denier: purchaseItem.denier - salesItem.denier,
      };
    });

    //   for (const ele of result) {
    //   if (ele.colorCode === data.colorCode && ele.colorQuality === data.colorQuality) {
    //     if (ele.weight < data.weight) {
    //       return {
    //         status: 400,
    //         message: message.WEIGHT_DIFFERENCE,
    //       };
    //     }
    //   }
    // }

    const YarnSalesData = {
      invoiceNo: data.invoiceNo,
      lotNo: data.lotNo,
      party: data.party,
      colorCode: data.colorCode,
      colorQuality: data.colorQuality,
      date: moment(data.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
      weight: data.weight,
      denier: data.denier,
      price: data.price,
    };

    const editYarnSales = await yarnSalesModel.findOneAndUpdate(
      { tokenId: token },
      YarnSalesData,
      { new: true }
    );

    await YarnPartySalesDetail.findOneAndUpdate(
      { tokenId: token },
      YarnSalesData,
      { new: true }
    );

    if (!editYarnSales) {
      return {
        status: 404,
        message: message.YARNSALES_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.YARNSALES_DATA_UPDATED,
      data: editYarnSales,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteYarnSalesDetail = async (whereCondition) => {
  try {
    const deleteYarnSales = await yarnSalesModel.deleteOne({
      tokenId: whereCondition,
    });
    if (!deleteYarnSales) {
      return {
        status: 404,
        message: "Unable to delete YarnSales",
      };
    }
    const deletePartyYarnSales = await YarnPartySalesDetail.deleteOne({
      tokenId: whereCondition,
    });

    if (!deletePartyYarnSales) {
      return {
        status: 404,
        message: "Unable to delete YarnSales",
      };
    }
    return {
      status: 200,
      message: message.YARNSALES_DELETE,
      data: deleteYarnSales,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

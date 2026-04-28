const message = require("../../common/error.message");
var moment = require("moment");
const {
  findAllSaleYarn,
  createSaleYarn,
  updateYarnSales,
  deleteSalesYarn,
} = require("../../DBQuery/Yarn/sales");
const { findAllYarnPurchase } = require("../../DBQuery/Yarn/purchase");
const {
  createPartySale,
  findAllPartySaleDetail,
  updatePartySalesDetail,
  deletePartySale,
} = require("../../DBQuery/Yarn/yarnPartySale");

const aggregateByColor = (details, includeDenier = true) => {
  const map = {};
  for (const detail of details) {
    const key = `${detail.colorCode}:${detail.colorQuality}`;
    if (!map[key]) {
      map[key] = {
        colorCode: detail.colorCode,
        colorQuality: detail.colorQuality,
        weight: 0,
        denier: 0,
      };
    }
    map[key].weight += detail.weight;
    if (includeDenier) {
      map[key].denier += detail.denier;
    }
  }
  return map;
};

exports.createYarnSales = async (yarnSales) => {
  try {
    const [salesDetails, purchaseDetails] = await Promise.all([
      findAllSaleYarn(),
      findAllYarnPurchase(),
    ]);

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
    const purchaseDictionary = aggregateByColor(purchaseDetails, false);
    const salesDictionary = aggregateByColor(salesDetails, false);

    for (const key of Object.keys(purchaseDictionary)) {
      const purchaseItem = purchaseDictionary[key] || { weight: 0, denier: 0 };
      const salesItem = salesDictionary[key] || { weight: 0, denier: 0 };
      if (
        purchaseItem.colorCode === yarnSales.colorCode &&
        purchaseItem.colorQuality === yarnSales.colorQuality &&
        purchaseItem.weight - salesItem.weight < yarnSales.weight
      ) {
        return {
          status: 400,
          message: message.WEIGHT_DIFFERENCE,
        };
      }
    }

    const yarnSalesData = {
      invoiceNo: yarnSales.invoiceNo,
      lotNo: yarnSales.lotNo,
      party: yarnSales.party,
      colorCode: yarnSales.colorCode,
      colorQuality: yarnSales.colorQuality,
      date: moment(yarnSales.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
      weight: yarnSales.weight,
      denier: yarnSales.denier,
      price: yarnSales.price,
    };
    const createYarnSalesDetail = await createSaleYarn(yarnSalesData);
    const detail = await createYarnSalesDetail.save();

    yarnSalesData["tokenId"] = createYarnSalesDetail.tokenId;
    const createYarnPartySalesDetail = await createPartySale(yarnSalesData);
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
    const salesDetails = await findAllPartySaleDetail();
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

    const editYarnSales = await updateYarnSales(token, YarnSalesData);

    await updatePartySalesDetail(token, YarnSalesData);

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

exports.deleteYarnSalesDetail = async (token) => {
  try {
    const deleteYarnSales = await deleteSalesYarn(token);

    if (!deleteYarnSales) {
      return {
        status: 404,
        message: "Unable to delete YarnSales",
      };
    }
    const deletePartyYarnSales = await deletePartySale(token);

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

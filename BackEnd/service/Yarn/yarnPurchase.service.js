const message = require("../../common/error.message");
const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");
var moment = require("moment");

exports.createYarnPurchase = async (yarnPurchase) => {
  try {
        const getYarnPurchase = await yarnPurchaseModel.find();

    for (const ele of getYarnPurchase) {
      if (ele.invoiceNo === yarnPurchase.invoiceNo) {
        return {
          status: 400,
          message: "yarnPurchase invoiceNo cannot be same!",
        };
      }
      else if (ele.lotNo === yarnPurchase.lotNo) {
        return {
          status: 400,
          message: "yarnPurchase lotNo cannot be same!",
        };
      }
    }
    const yarnPurchaseData = {
      invoiceNo: yarnPurchase.invoiceNo,
      lotNo: yarnPurchase.lotNo,
      party: yarnPurchase.party,
      colorCode: yarnPurchase.colorCode,
      colorQuality: yarnPurchase.colorQuality,
      date: moment(yarnPurchase.date, "DD/MM/YYYY").format("DD/MM/YYYY"),
      weight: yarnPurchase.weight,
      denier: yarnPurchase.denier,
    };
    const createYarnPurchaseDetail = new yarnPurchaseModel(yarnPurchaseData);
    const detail = await createYarnPurchaseDetail.save();

    return {
      status: 200,
      message: message.YARN_PURCHASE_CREATED,
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

exports.findYarnPurchase = async () => {
  try {
    const getYarnPurchase = await yarnPurchaseModel.find();
    if (!getYarnPurchase) {
      return {
        status: 404,
        message: message.YARNPURCHASE_NOT_FOUND,
      };
    }
    return getYarnPurchase;
  } catch (error) {
    throw error;
  }
};

exports.editYarnPurchaseDetail = async (data, token) => {
  try {
    
    const existingPurchaseInvoice = await yarnPurchaseModel.findOne({ invoiceNo: data.invoiceNo });

    if (existingPurchaseInvoice && existingPurchaseInvoice.tokenId !== token) {
      return {
        status: 400,
        message: "YarnPurchase invoiceNo cannot be the same!",
      };
    } 

    const existingPurchaseLotNo = await yarnPurchaseModel.findOne({ lotNo: data.lotNo });

    if (existingPurchaseLotNo && existingPurchaseLotNo.tokenId !== token) {
      return {
        status: 400,
        message: "YarnPurchase lotNo cannot be the same!",
      };
    } 
    const YarnPurchaseData = {
      invoiceNo: data.invoiceNo,
      lotNo: data.lotNo,
      party: data.party,
      colorCode: data.colorCode,
      colorQuality: data.colorQuality,
      date: moment(data.date,"DD/MM/YYYY").format("DD/MM/YYYY"),
      weight: data.weight,
      denier: data.denier,
    };

    const editYarnPurchase = await yarnPurchaseModel.findOneAndUpdate(
      { tokenId: token },
      YarnPurchaseData,
      { new: true }
    );

    if (!editYarnPurchase) {
      return {
        status: 404,
        message: message.YARNPURCHASE_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.YARNPURCHASE_DATA_UPDATED,
      data: editYarnPurchase,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteYarnPurchaseDetail = async (whereCondition) => {
  try {
    const deleteYarnPurchase = await yarnPurchaseModel.deleteOne({
      tokenId: whereCondition,
    });
    if (!deleteYarnPurchase) {
      return {
        status: 404,
        message: "Unable to delete YarnPurchase",
      };
    }
    return {
      status: 200,
      message: message.YARNPURCHASE_DELETE,
      data: deleteYarnPurchase,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

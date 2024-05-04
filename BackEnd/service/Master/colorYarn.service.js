const message = require("../../common/error.message");
const {
  findYarnColor,
  updateColorYarn,
  deleteYarnColor,
  findParticularYarnColor,
  createYarnColor,
  findColorYarnById,
} = require("../../DBQuery/Master/colorYarn");
const { findAllMatchings } = require("../../DBQuery/Master/matching");
const { findAllOrders } = require("../../DBQuery/Order/order");

exports.createColorYarnDetail = async (colorYarn) => {
  try {
    const getColorYarn = await findYarnColor();

    for (const ele of getColorYarn) {
      if (ele.colorCode.toLowerCase() === colorYarn.colorCode.toLowerCase()) {
        return {
          status: 400,
          message: "ColorYarn colorCode cannot be the same!",
        };
      }
    }

    const colorYarnData = {
      colorCode: colorYarn.colorCode,
      colorQuality: colorYarn.colorQuality,
      denier: colorYarn.denier,
    };
    const createColorYarnDetail = await createYarnColor(colorYarnData);
    const detail = await createColorYarnDetail.save();

    return {
      status: 200,
      message: message.COLORYARN_CREATED,
      data: detail,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findColorYarn = async () => {
  try {
    const getColorYarn = await findYarnColor();
    if (!getColorYarn || getColorYarn.length === 0) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }

    const renamedColorYarn = getColorYarn.map((yarn) => ({
      _id: yarn._id,
      colorCode: yarn.colorCode,
      colorQuality: yarn.colorQuality,
      denier: yarn.denier,
      tokenId: yarn.tokenId,
      __v: yarn.__v,
    }));

    return renamedColorYarn;
  } catch (error) {
    throw error;
  }
};

exports.editColorYarnDetail = async (data, token) => {
  try {
    const existingColorCode = await findParticularYarnColor(data);
    if (
      existingColorCode &&
      existingColorCode.tokenId !== token &&
      existingColorCode.colorCode.toLowerCase() === data.colorCode.toLowerCase()
    ) {
      return {
        status: 400,
        message: "ColorYarn colorCode cannot be the same!",
      };
    }

    // const existingColorShade = await colorYarnModel.findOne({
    //   colorQuality: { $regex: new RegExp(data.colorQuality, "i") },
    // });
    // if (
    //   existingColorShade &&
    //   existingColorShade.tokenId !== token &&
    //   existingColorShade.colorQuality.toLowerCase() === data.colorQuality.toLowerCase()
    // ) {
    //   return {
    //     status: 400,
    //     message: "ColorYarn colorQuality cannot be the same!",
    //   };
    // }

    const colorYarnData = {
      colorCode: data.colorCode,
      denier: data.denier,
      colorQuality: data.colorQuality,
    };

    const editColorYarn = await updateColorYarn(token, colorYarnData);

    if (!editColorYarn) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.COLORYARN_DATA_UPDATED,
      data: editColorYarn,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteColorYarnDetail = async (token) => {
  try {
    const getAllOrders = await findAllOrders();
    const orderArr = [];
    for (const order of getAllOrders) {
      for (const ele of order?.orders) {
        if (ele?.pcs !== ele?.completePcs + ele?.dispatch + ele?.settlePcs + ele?.salePcs) {
          orderArr.push(ele);
        }
      }
    }
    console.log("==orderArr==", orderArr);
    const getMatch = await findAllMatchings();

    const findMatchingData = getMatch.filter((ele) =>
      orderArr.some((item) => item.matchingId === ele.matchingId)
    );
    const yarnCollect = [];
    for (const data of findMatchingData) {
      for (const [key, value] of Object.entries(data.feeders)) {
        yarnCollect.push(value);
      }
    }
    const getYarn = await findColorYarnById(token);

    const matchYarn = yarnCollect.find((yarn) => yarn === getYarn?.colorCode);
    if (matchYarn) {
      return {
        status: 409,
        message:
          "Color yarn order is in process. After completing this color yarn order, you can delete it.",
      };
    }

    const deleteColorYarn = await deleteYarnColor(token);
    if (!deleteColorYarn) {
      return {
        status: 404,
        message: "Unable to delete colorYarn",
      };
    }
    return {
      status: 200,
      message: message.COLORYARN_DELETE,
      data: deleteColorYarn,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findColorCode = async (data) => {
  try {
    const getColorYarn = await findYarnColor();
    if (!getColorYarn || getColorYarn.length === 0) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }

    const codeDetail = getColorYarn.find((ele) => ele.colorCode === data);
    if (codeDetail) {
      return {
        status: 200,
        message: message.COLORCODE_DATA_FOUND,
        data: codeDetail,
      };
    } else {
      return {
        status: 404,
        message: message.COLORCODE_DATA_NOTFOUND,
      };
    }
  } catch (error) {
    console.log("==error==", error);
    throw error;
  }
};

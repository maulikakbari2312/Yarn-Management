const message = require("../../common/error.message");
const { v4: uuidv4 } = require("uuid");
const {
  findAllMatchings,
  createMatching,
  findMatchingsById,
  updateMatching,
  deleteMatchingInfo,
} = require("../../DBQuery/Master/matching");
const { findYarnColor } = require("../../DBQuery/Master/colorYarn");
const { findDesigns } = require("../../DBQuery/Master/design");
const { findAllOrders } = require("../../DBQuery/Order/order");
const uniqueMatchingId = () => uuidv4();
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return Math.abs(hash) % 1000000;
};
const isEqualObject = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
const buildFeeders = (source, feederCount) => {
  const feeders = {};
  for (let i = 1; i <= feederCount; i++) {
    feeders[`f${i}`] = source[`f${i}`];
  }
  return feeders;
};

exports.createMatchingDetail = async (matching) => {
  try {
    const uniqueId = uniqueMatchingId();
    const MatchingId = hashCode(uniqueId);

    const matchingData = {
      name: matching.name,
      pick: matching.pick,
      pallu: matching.pallu,
      ground: matching.ground,
      feeder: matching.feeder,
    };
    const feeders = buildFeeders(matching, matching.feeder);

    const findMatching = await findAllMatchings();
    const hasSameFeeders = findMatching.some((ele) =>
      isEqualObject(ele.feeders, feeders)
    );
    if (hasSameFeeders) {
      return {
        status: 404,
        message: message.IT_IS_SAME_FEEDERS,
      };
    }

    const finalMatchingData = {
      ...matchingData,
      feeders,
      matchingId: MatchingId,
    };
    const createMatchingDetail = await createMatching(finalMatchingData);
    const detail = await createMatchingDetail.save();

    return {
      status: 200,
      message: message.MATCHING_CREATED,
      data: detail,
    };
  } catch (error) {
    console.log("==error===", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findColorMatching = async () => {
  try {
    const getColorYarn = await findYarnColor();

    if (!getColorYarn) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }

    const findColorYarn = getColorYarn
      .map((ele) => {
        return {
          colorCode: ele.colorCode,
        };
      })
      .filter((ele) => ele.colorCode);

    return findColorYarn;
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

exports.findDesign = async () => {
  try {
    const getDesign = await findDesigns();

    if (!getDesign) {
      return {
        status: 404,
        message: message.COLORYARN_NOT_FOUND,
      };
    }

    const findDesignDetail = getDesign
      .map((ele) => {
        return {
          name: ele.name,
          pick: ele.pick,
        };
      })
      .filter((ele) => ele.name && ele.pick);

    return findDesignDetail;
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

exports.matchingList = async (matchingData) => {
  try {
    const getMatching = await findAllMatchings();

    if (!getMatching) {
      return {
        status: 400,
        message: message.MATCHING_NOT_FOUND,
      };
    }

    const filteredMatching = getMatching.filter((ele) => {
      return ele.name === matchingData.name && ele.pick === matchingData.pick;
    });

    return filteredMatching;
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

exports.editMatchingDetail = async (data, token) => {
  try {
    const getMatching = await findMatchingsById(token);
    const feeders = buildFeeders(data, getMatching.feeder);
    const findMatching = await findAllMatchings();
    const hasSameFeeders = findMatching.some((ele) =>
      isEqualObject(ele.feeders, feeders)
    );
    if (hasSameFeeders) {
      return {
        status: 404,
        message: message.IT_IS_SAME_FEEDERS,
      };
    }
    const updateMatchingDetail = await updateMatching(token, feeders);

    if (!updateMatchingDetail) {
      return {
        status: 404,
        message: message.MATCHING_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.MATCHING_DATA_UPDATED,
      pageItems: updateMatchingDetail,
    };
  } catch (error) {
    console.log("==error===", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteMatchingDetail = async (token) => {
  try {
    const getMatching = await findMatchingsById(token);
    const getAllOrders = await findAllOrders();
    const hasInProcessMatchingOrder = getAllOrders.some((order) =>
      order?.orders?.some(
        (ele) =>
          ele.matchingId === getMatching.matchingId &&
          ele.pcs !== ele.completePcs + ele.dispatch + ele.settlePcs + ele?.salePcs
      )
    );

    if (hasInProcessMatchingOrder) {
      return {
        status: 409,
        message: "Matching order is in process. After completing this matching order, you can delete it.",
      };
    }

    const deleteMatching = await deleteMatchingInfo(token);

    if (!deleteMatching) {
      return {
        status: 404,
        message: "Unable to delete Matching",
      };
    }
    return {
      status: 200,
      message: message.MATCHING_DELETE,
      data: deleteMatching,
    };
  } catch (error) {
    console.log("==error===", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findGroundColor = async (design) => {
  try {
    const getGroundColor = await findAllMatchings();
    const groundColorArr = getGroundColor.filter((ele) => ele.name === design);

    if (!groundColorArr.length) {
      return {
        status: 404,
        message: message.MATCHING_NOT_AVAILABLE,
      };
    }

    const uniqGroundColor = [...new Set(groundColorArr)];
    return uniqGroundColor;
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

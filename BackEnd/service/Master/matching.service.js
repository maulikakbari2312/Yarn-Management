const message = require("../../common/error.message");
const { v4: uuidv4 } = require("uuid");
const {
  findMatchings,
  createMatching,
  findMatchingsById,
  updateMatching,
  deleteMatchingInfo,
} = require("../../DBQuery/Master/matching");
const { findYarnColor } = require("../../DBQuery/Master/colorYarn");
const { findDesigns } = require("../../DBQuery/Master/design");
const uniqueMatchingId = () => uuidv4();

exports.createMatchingDetail = async (matching) => {
  try {
    const uniqueId = uniqueMatchingId(); // Use uuidv4 directly

    function hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
      }
      return Math.abs(hash) % 1000000; // 6-digit number
    }
    const MatchingId = hashCode(uniqueId);

    const matchingData = {
      name: matching.name,
      pick: matching.pick,
      pallu: matching.pallu,
      ground: matching.ground,
      feeder: matching.feeder,
    };

    const feeders = {};

    for (let i = 1; i <= matching.feeder; i++) {
      feeders[`f${i}`] = matching[`f${i}`];
    }

    const findMatching = await findMatchings();

    const isEqual = (obj1, obj2) =>
      JSON.stringify(obj1) === JSON.stringify(obj2);
    for (const ele of findMatching) {
      if (isEqual(ele.feeders, feeders)) {
        return {
          status: 404,
          message: message.IT_IS_SAME_FEEDERS,
        };
      }
    }

    const finalMatchingData = {
      ...matchingData,
      feeders: feeders,
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
    console.log("==error===",error);
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
    console.log("==error===",error);
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
    console.log("==error===",error);
    throw error;
  }
};

exports.matchingList = async (matchingData) => {
  try {
    const getMatching = await findMatchings();

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
    console.log("==error===",error);
    throw error;
  }
};

exports.editMatchingDetail = async (data, token) => {
  try {
    const getMatching = await findMatchingsById(token);
    const feeders = {};

    for (let i = 1; i <= getMatching[0].feeder; i++) {
      feeders[`f${i}`] = data[`f${i}`];
    }
    const findMatching = await findMatchings();
    const isEqual = (obj1, obj2) =>
      JSON.stringify(obj1) === JSON.stringify(obj2);
    for (const ele of findMatching) {
      if (isEqual(ele.feeders, feeders)) {
        return {
          status: 404,
          message: message.IT_IS_SAME_FEEDERS,
        };
      }
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
    console.log("==error===",error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deleteMatchingDetail = async (token) => {
  try {
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
    console.log("==error===",error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findGroundColor = async (design) => {
  try {
    const getGroundColor = await findMatchings();

    const groundColorArr = [];
    for (let ele of getGroundColor) {
      if (ele.name === design) {
        groundColorArr.push(ele);
      }
    }

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

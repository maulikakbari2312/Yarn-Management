const { findDesignById } = require("../../DBQuery/Master/design");
const { findAllMatchings } = require("../../DBQuery/Master/matching");

exports.findReportDesign = async (design) => {
  try {
    const findDesign = await findDesignById({ name: design });
    if (!findDesign) {
      return {
        status: 404,
        message: message.DESIGN_NOT_FOUND,
      };
    }

    const matchingData = await findAllMatchings({ name: design });

    const uniqueObjects = [];

    for (const obj of matchingData) {
      let isDuplicate = false;

      for (const uniqueObj of uniqueObjects) {
        if (JSON.stringify(obj.feeders) === JSON.stringify(uniqueObj.feeders)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueObjects.push(obj);
      }
    }

    return {
      ...findDesign.toObject(),
      matching: uniqueObjects,
    };
  } catch (error) {
    console.log("==error===", error);
    throw error;
  }
};

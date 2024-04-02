const matchingModel = require("../../model/Master/matching.model");
const designModel = require("../../model/Master/design.model");

exports.findReportDesign = async (data) => {
  try {
    const design = await designModel.findOne({ name: data });
    if (!design) {
      return {
        status: 404,
        message: message.DESIGN_NOT_FOUND,
      };
    }

    const matchingData = await matchingModel.find({ name: data });

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
      ...design.toObject(),
      matching: uniqueObjects,
    };
  } catch (error) {
    throw error;
  }
};
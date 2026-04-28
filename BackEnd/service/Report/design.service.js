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
    const feederSignatures = new Set();
    for (const obj of matchingData) {
      const feederSignature = JSON.stringify(obj.feeders);
      if (!feederSignatures.has(feederSignature)) {
        feederSignatures.add(feederSignature);
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

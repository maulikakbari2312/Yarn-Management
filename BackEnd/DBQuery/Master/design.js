const designModel = require("../../model/Master/design.model");

exports.findDesigns = async () => {
  const getDesign = await designModel.find();
  return getDesign;
};

exports.createDesign = async (design) => {
  const createDesigns = new designModel(design);
  return createDesigns;
};

exports.findParticularDesign = async (data) => {
  const findDesign = await designModel.findOne({
    name: { $regex: new RegExp(data.name, "i") },
  });
  return findDesign;
};

exports.updateDesign = async (token, designData) => {
  const updateDesigns = await designModel.findOneAndUpdate(
    { tokenId: token },
    designData,
    { new: true }
  );
  return updateDesigns;
};

exports.findDesignById = async (whereCondition) => {
  const findDesigns = await designModel.findOne({
    tokenId: whereCondition,
  });
  return findDesigns;
};

exports.deleteDesignInfo = async (whereCondition) => {
  const deleteDesign = await designModel.deleteOne({
    tokenId: whereCondition,
  });
  return deleteDesign;
};

const colorYarnModel = require("../../model/Master/colorYarn.model");

exports.findYarnColor = async () => {
  const getColorYarn = await colorYarnModel.find();
  return getColorYarn;
};

exports.createYarnColor = async (colorYarnData) => {
  const createColorYarn = await new colorYarnModel(colorYarnData)
  return createColorYarn;
};

exports.updateColorYarn = async (token,colorYarnData) => {
  const updateColorYarn = await colorYarnModel.findOneAndUpdate(
    { tokenId: token },
    colorYarnData,
    { new: true }
  );
  return updateColorYarn;
};

exports.deleteYarnColor = async (whereCondition) => {
  const deleteColorYarn = await colorYarnModel.deleteOne({
    tokenId: whereCondition,
  });
  return deleteColorYarn;
};

exports.findParticularYarnColor = async (data) => {
  const getYarnColor = await colorYarnModel.findOne({
    colorCode: { $regex: new RegExp(data.colorCode, "i") },
  });
  return getYarnColor;
};
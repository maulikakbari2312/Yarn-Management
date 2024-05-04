const yarnPurchaseModel = require("../../model/Yarn/yarnPurchase.model");

exports.findAllYarnPurchase = async () => {
  const yarnPurchase = await yarnPurchaseModel.find();
  return yarnPurchase;
};

exports.purchaseYarnCreate = async (yarnPurchaseData) => {
  const createYarnPurchase = await new yarnPurchaseModel(yarnPurchaseData);
  return createYarnPurchase;
};

exports.findYarnPurchaseByData = async (data) => {
  const findYarnPurchase = await yarnPurchaseModel.findOne(data);
  return findYarnPurchase;
};

exports.updateYarnPurchase = async (token, YarnPurchaseData) => {
  const updatepurchase = await yarnPurchaseModel.findOneAndUpdate(
    { tokenId: token },
    YarnPurchaseData,
    { new: true }
  );
  return updatepurchase;
};

exports.deletePurchaseYarn = async (token) => {
  const deletePurchase = await yarnPurchaseModel.deleteOne({
    tokenId: token,
  });
  return deletePurchase;
};

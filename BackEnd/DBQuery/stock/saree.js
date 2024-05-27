const saleSareeModel = require("../../model/Order/sareeSale.model");

exports.createSaleSaree = async (saleSareeData) => {
  const createSaleSaree = new saleSareeModel(saleSareeData);
  return createSaleSaree;
};

exports.getAllSareeStock = async () => {
  const getSareeStock = await saleSareeModel.find().sort({ createdAt: -1 });
  return getSareeStock;
};

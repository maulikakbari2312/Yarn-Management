const saleSareeModel = require("../../model/Order/sareeSale.model");

exports.createSaleSaree = async (saleSareeData) => {
  const createSaleSaree = await new saleSareeModel(saleSareeData);
  return createSaleSaree;
};

exports.getAllSareeStock = async () => {
  const getSareeStock = await saleSareeModel.find();
  return getSareeStock;
};

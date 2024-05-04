const YarnSalesDetail = require("../../model/Yarn/yarnSales.model");

exports.findAllSaleYarn = async () => {
  const findSaleYarn = await YarnSalesDetail.find();
  return findSaleYarn;
};

exports.deleteYarn = async (tokenId) => {
  const deleteSaleYarn = await YarnSalesDetail.deleteMany({
    orderToken: tokenId,
  });
  return deleteSaleYarn;
};

exports.createSaleYarn = async (yarnData) => {
  const createSaleYarn = await new YarnSalesDetail(yarnData);
  return createSaleYarn;
};

exports.updateYarnSales = async (token, YarnSalesData) => {
  const updateSales =  await YarnSalesDetail.findOneAndUpdate(
    { tokenId: token },
    YarnSalesData,
    { new: true }
  );
  return updateSales;
};

exports.deleteSalesYarn = async (token) => {
  const deleteSales = await YarnSalesDetail.deleteOne({
    tokenId: token,
  });
  return deleteSales;
};
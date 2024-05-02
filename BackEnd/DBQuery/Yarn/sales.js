const YarnSalesDetail = require("../../model/Yarn/yarnSales.model");

exports.findAllSaleYarn = async () => {
    const findSaleYarn = await YarnSalesDetail.find();
    return findSaleYarn;
  };
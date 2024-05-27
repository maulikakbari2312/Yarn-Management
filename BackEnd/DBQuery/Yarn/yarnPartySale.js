const YarnPartySalesDetail = require("../../model/Yarn/yarnPartySales");

exports.createPartySale = async (partySale) => {
    const createpartySalesDetail = new YarnPartySalesDetail(partySale);
    return createpartySalesDetail;
  };

  exports.findAllPartySaleDetail = async () => {
    const findPartySale = await YarnPartySalesDetail.find().sort({ createdAt: -1 });
    return findPartySale;
  };

  exports.updatePartySalesDetail = async (token, partySaleData) => {
    const updatePartySale =  await YarnPartySalesDetail.findOneAndUpdate(
      { tokenId: token },
      partySaleData,
      { new: true }
    );
    return updatePartySale;
  };

  exports.deletePartySale = async (token) => {
    const deleteSales = await YarnPartySalesDetail.deleteOne({
      tokenId: token,
    });
    return deleteSales;
  };
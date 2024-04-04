const matchingModel = require("../../model/Master/matching.model");

exports.findMatchings = async () => {
    const getMatching = await matchingModel.find();
    return getMatching;
  };

  exports.createMatching = async (finalMatchingData) => {
    const createMatchings = await new matchingModel(finalMatchingData);
    return createMatchings;
  };

  exports.findMatchingsById = async (token) => {
    const findMatchingById = await matchingModel.find({
      tokenId: token,
    });
    return findMatchingById;
  };

  exports.updateMatching = async (token, feeders) => {
    const updateMatchings = await matchingModel.findOneAndUpdate(
      { tokenId: token },
      { feeders: feeders },
      { new: true }
    );
    return updateMatchings;
  };

  exports.deleteMatchingInfo = async (token) => {
    const deleteMatching = await matchingModel.deleteOne({
      tokenId: token,
    });
    return deleteMatching;
  };
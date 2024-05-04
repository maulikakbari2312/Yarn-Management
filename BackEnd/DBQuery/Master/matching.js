const matchingModel = require("../../model/Master/matching.model");

exports.findAllMatchings = async (data={}) => {
  const getMatching = await matchingModel.find(data);
  return getMatching;
};

exports.createMatching = async (finalMatchingData) => {
  const createMatchings = await new matchingModel(finalMatchingData);
  return createMatchings;
};

exports.findMatchingsById = async (token) => {
  const findMatchingById = await matchingModel.findOne({
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

exports.findMatchingByMatchingId = async (matchingId) => {
  const getMatching = await matchingModel.findOne(matchingId);
  return getMatching;
};
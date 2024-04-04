const partyModel = require("../../model/Master/party.model");

exports.findParties = async () => {
  const getParty = await partyModel.find();
  return getParty;
};

exports.createParty = async (partyData) => {
  const createParty = await new partyModel(partyData);
  return createParty;
};

exports.findParticularParty = async (data) => {
  const findParty = await partyModel.findOne({
    name: { $regex: new RegExp(data.name, "i") },
  });
  return findParty;
};

exports.updatePartyInfo = async (token, partyData) => {
  const updateParty = await partyModel.findOneAndUpdate(
    { tokenId: token },
    partyData,
    { new: true }
  );
  return updateParty;
};

exports.deletePartyInfo = async (token) => {
  const deleteParty = await partyModel.deleteOne({
    tokenId: token,
  });
  return deleteParty;
};

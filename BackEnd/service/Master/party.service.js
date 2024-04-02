const message = require("../../common/error.message");
const partyModel = require("../../model/Master/party.model");

exports.createPartyDetail = async (party) => {
  try {
    const getParty = await partyModel.find();

    for (const ele of getParty) {
      if (
        ele.name.toLowerCase() === party.name.toLowerCase() &&
        ele.type.toLowerCase() === party.type.toLowerCase()
      ) {
        return {
          status: 400,
          message: "Party name cannot be the same!",
        };
      }
    }

    const partyData = {
      name: party.name,
      address: party.address,
      mobile: party.mobile,
      type: party.type,
    };
    const createPartyDetail = new partyModel(partyData);
    const detail = await createPartyDetail.save();

    return {
      status: 200,
      message: message.PARTY_CREATED,
      data: detail,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.findParty = async () => {
  try {
    const getParty = await partyModel.find();
    if (!getParty) {
      return {
        status: 404,
        message: message.PARTY_NOT_FOUND,
      };
    }
    return getParty;
  } catch (error) {
    throw error;
  }
};

exports.editPartyDetail = async (data, token) => {
  try {
    const getPartyName = await partyModel.findOne({
      name: { $regex: new RegExp(data.name, "i") },
    });

    if (
      getPartyName &&
      getPartyName.tokenId !== token &&
      getPartyName.name.toLowerCase() === data.name.toLowerCase() &&
      getPartyName.type.toLowerCase()  === data.type.toLowerCase() 
    ) {
      return {
        status: 400,
        message: "Party name cannot be the same!",
      };
    }

    // const getPartyAddress = await partyModel.findOne({ address: { $regex: new RegExp(data.address, 'i') } });

    // if (getPartyAddress && getPartyAddress.tokenId !== token) {
    //   return {
    //     status: 400,
    //     message: "Party address cannot be the same!",
    //   };
    // }

    // const getPartyMobile = await partyModel.findOne({ mobile: data.mobile });

    // if (getPartyMobile && getPartyMobile.tokenId !== token) {
    //   return {
    //     status: 400,
    //     message: "Party mobile cannot be the same!",
    //   };
    // }

    const partyData = {
      name: data.name,
      address: data.address,
      mobile: data.mobile,
      type: data.type,
    };

    const editParty = await partyModel.findOneAndUpdate(
      { tokenId: token },
      partyData,
      { new: true }
    );

    if (!editParty) {
      return {
        status: 404,
        message: message.PARTY_NOT_FOUND,
      };
    }

    return {
      status: 200,
      message: message.PARTY_DATA_UPDATED,
      data: editParty,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

exports.deletePartyDetail = async (whereCondition) => {
  try {
    const deleteParty = await partyModel.deleteOne({
      tokenId: whereCondition,
    });
    if (!deleteParty) {
      return {
        status: 404,
        message: "Unable to delete company",
      };
    }
    return {
      status: 200,
      message: message.PARTY_DELETE,
      data: deleteParty,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

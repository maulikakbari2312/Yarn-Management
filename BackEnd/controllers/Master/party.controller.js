const partyService = require("../../service/Master/party.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

exports.createParty = async (req, res) => {
  try {
    const partData = await partyService.createPartyDetail(req.body);

    if (!partData) {
      throw new Error("Please enter valid party information!");
    }

    return res.status(partData.status).send(partData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getParty = async (req, res) => {
  try {
    const findParty = await partyService.findParty();

    if (!Array.isArray(findParty)) {
      return res.status(findParty.status).send(findParty);
    }

    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = parseInt(req.query.offset, 10) || 0;

    const pageItems = findParty;

    const totalItems = findParty.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "party" : "parties";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} available`,
    };
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editParty = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editPartyData = await partyService.editPartyDetail(req.body, token);

    return res.status(editPartyData.status).send(editPartyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deletePartyData = await partyService.deletePartyDetail(token);

    return res.status(deletePartyData.status).send(deletePartyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

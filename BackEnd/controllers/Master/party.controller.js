const partyService = require("../../service/Master/party.service");
exports.createParty = async (req, res) => {
  try {
    const partData = await partyService.createPartyDetail(req.body);

    if (!partData) {
      throw new Error("Please enter valid party information!");
    }

    res.status(partData.status).send(partData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.getParty = async (req, res) => {
  try {
    const findParty = await partyService.findParty();

    if (!Array.isArray(findParty)) {
      return res.status(findParty.status).send(findParty);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findParty;
    // .slice(startIndex, endIndex);

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
    res.status(200).send(response);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.editParty = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editPartyData = await partyService.editPartyDetail(req.body, token);

    res.status(editPartyData.status).send(editPartyData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

exports.deleteParty = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deletePartyData = await partyService.deletePartyDetail(token);

    res.status(deletePartyData.status).send(deletePartyData);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      res.status(400).json({ errorMessages });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

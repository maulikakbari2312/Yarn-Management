const message = require("../../common/error.message");
const matchingService = require("../../service/Master/matching.service");
exports.createMatching = async (req, res) => {
  try {
    const matchingData = await matchingService.createMatchingDetail(req.body);
    if (!matchingData) {
      throw new Error("Please enter valid matching information!");
    }

    res.status(matchingData.status).send(matchingData);
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

exports.getColorMatching = async (req, res) => {
  try {
    const findColorYarn = await matchingService.findColorMatching();
   
    if (!Array.isArray(findColorYarn)) {
      return res.status(findColorYarn.status).send(findColorYarn);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findColorYarn;
    // .slice(startIndex, endIndex);

    const totalItems = findColorYarn.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "color matching is" : "color matching are";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems,
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

exports.getDesignMatching = async (req, res) => {
  try {
    const findDesign = await matchingService.findDesign();

    if (!Array.isArray(findDesign)) {
      return res.status(findDesign.status).send(findDesign);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findDesign;
    // .slice(startIndex, endIndex);

    const totalItems = findDesign.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "color matching is" : "color matching are";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems,
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

exports.matchingList = async (req, res) => {
  try {
    const { name, pick } = req.body; // Use object destructuring
    const matchingData = { name, pick };

    const findMatching = await matchingService.matchingList(matchingData);

    if (!Array.isArray(findMatching)) {
      return res.status(findMatching.status).send(findMatching);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findMatching;
    // .slice(startIndex, endIndex);

    const totalItems = findMatching.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "matching" : "matchings";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems,
      message: `Total ${totalItems} ${status} find successfully`,
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

exports.editMatching = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editMatchingData = await matchingService.editMatchingDetail(
      req.body,
      token
    );

    res.status(editMatchingData.status).send(editMatchingData);
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

exports.deleteMatching = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteCompanyData = await matchingService.deleteMatchingDetail(token);

    res.status(deleteCompanyData.status).send(deleteCompanyData);
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

exports.findGroundColor = async (req, res) => {
  try {
    const design = req.body.design;
    const findColorYarn = await matchingService.findGroundColor(design);

    if (!Array.isArray(findColorYarn)) {
      return res.status(findColorYarn.status).send(findColorYarn);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findColorYarn;
    // .slice(startIndex, endIndex);

    const totalItems = findColorYarn.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "groundColor" : "groundColors";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems,
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
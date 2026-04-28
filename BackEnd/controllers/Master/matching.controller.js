const matchingService = require("../../service/Master/matching.service");

const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const errorMessages = Object.values(error.errors).map(
      (err) => err.message
    );
    return res.status(400).json({ errorMessages });
  }

  return res.status(500).json({ error: "Internal Server Error" });
};

const getPagination = (req) => {
  const limit = parseInt(req.query.limit, 10) || 1000;
  const offset = parseInt(req.query.offset, 10) || 0;
  return { limit, offset };
};

const buildPagedResponse = (items, limit, offset, messageText) => ({
  page: offset + 1,
  totalPages: Math.ceil(items.length / limit),
  itemsPerPage: limit,
  total: items.length,
  pageItems: items,
  message: messageText,
});

exports.createMatching = async (req, res) => {
  try {
    const matchingData = await matchingService.createMatchingDetail(req.body);
    if (!matchingData) {
      throw new Error("Please enter valid matching information!");
    }

    return res.status(matchingData.status).send(matchingData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getColorMatching = async (req, res) => {
  try {
    const findColorYarn = await matchingService.findColorMatching();
   
    if (!Array.isArray(findColorYarn)) {
      return res.status(findColorYarn.status).send(findColorYarn);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findColorYarn.length;
    const status =
      totalItems === 1 ? "color matching is" : "color matching are";

    const response = buildPagedResponse(
      findColorYarn,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getDesignMatching = async (req, res) => {
  try {
    const findDesign = await matchingService.findDesign();

    if (!Array.isArray(findDesign)) {
      return res.status(findDesign.status).send(findDesign);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findDesign.length;
    const status =
      totalItems === 1 ? "color matching is" : "color matching are";

    const response = buildPagedResponse(
      findDesign,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
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

    const { limit, offset } = getPagination(req);

    const totalItems = findMatching.length;
    const status = totalItems === 1 ? "matching" : "matchings";

    const response = buildPagedResponse(
      findMatching,
      limit,
      offset,
      `Total ${totalItems} ${status} find successfully`
    );

    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editMatching = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editMatchingData = await matchingService.editMatchingDetail(
      req.body,
      token
    );

    return res.status(editMatchingData.status).send(editMatchingData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteMatching = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteCompanyData = await matchingService.deleteMatchingDetail(token);

    return res.status(deleteCompanyData.status).send(deleteCompanyData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findGroundColor = async (req, res) => {
  try {
    const design = req.body.design;
    const findColorYarn = await matchingService.findGroundColor(design);

    if (!Array.isArray(findColorYarn)) {
      return res.status(findColorYarn.status).send(findColorYarn);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findColorYarn.length;
    const status = totalItems === 1 ? "groundColor" : "groundColors";

    const response = buildPagedResponse(
      findColorYarn,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
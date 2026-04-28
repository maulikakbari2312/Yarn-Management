const yarnPurchaseService = require("../../service/Yarn/yarnPurchase.service");

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

exports.createYarnPurchase = async (req, res) => {
  try {
    const yarnPurchaseData = await yarnPurchaseService.createYarnPurchase(
      req.body
    );

    if (!yarnPurchaseData) {
      throw new Error("Please enter valid yarnPurchase information!");
    }

    return res.status(yarnPurchaseData.status).send(yarnPurchaseData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getYarnPurchase = async (req, res) => {
  try {
    const findYarnPurchase = await yarnPurchaseService.findYarnPurchase();

    if (!Array.isArray(findYarnPurchase)) {
      return res.status(findYarnPurchase.status).send(findYarnPurchase);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findYarnPurchase.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnPurchase" : "YarnPurchases";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: findYarnPurchase,
      message: `Total ${totalItems} ${status} available`,
    };
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editYarnPurchase = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editYarnPurchaseData =
      await yarnPurchaseService.editYarnPurchaseDetail(req.body, token);

    return res.status(editYarnPurchaseData.status).send(editYarnPurchaseData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteYarnPurchase = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteYarnPurchaseData =
      await yarnPurchaseService.deleteYarnPurchaseDetail(token);

    return res.status(deleteYarnPurchaseData.status).send(deleteYarnPurchaseData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

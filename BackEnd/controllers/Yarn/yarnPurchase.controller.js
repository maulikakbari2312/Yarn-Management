const yarnPurchaseService = require("../../service/Yarn/yarnPurchase.service");

exports.createYarnPurchase = async (req, res) => {
  try {
    const yarnPurchaseData = await yarnPurchaseService.createYarnPurchase(
      req.body
    );

    if (!yarnPurchaseData) {
      throw new Error("Please enter valid yarnPurchase information!");
    }

    res.status(yarnPurchaseData.status).send(yarnPurchaseData);
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

exports.getYarnPurchase = async (req, res) => {
  try {
    const findYarnPurchase = await yarnPurchaseService.findYarnPurchase();

    if (!Array.isArray(findYarnPurchase)) {
      return res.status(findYarnPurchase.status).send(findYarnPurchase);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findYarnPurchase.slice(startIndex, endIndex);

    const totalItems = findYarnPurchase.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnPurchase" : "YarnPurchases";

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

exports.editYarnPurchase = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editYarnPurchaseData =
      await yarnPurchaseService.editYarnPurchaseDetail(req.body, token);

    res.status(editYarnPurchaseData.status).send(editYarnPurchaseData);
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

exports.deleteYarnPurchase = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteYarnPurchaseData =
      await yarnPurchaseService.deleteYarnPurchaseDetail(token);

    res.status(deleteYarnPurchaseData.status).send(deleteYarnPurchaseData);
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

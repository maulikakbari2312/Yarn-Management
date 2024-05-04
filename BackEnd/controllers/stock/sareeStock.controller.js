const sareeStockService = require("../../service/stock/sareeStock.service");

exports.getSareeStock = async (req, res) => {
  try {
    const findAllSareeStock = await sareeStockService.getSareeStock();

    if (!Array.isArray(findAllSareeStock)) {
      return res.status(findAllSareeStock.status).send(findAllSareeStock);
    }

    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllSareeStock.slice(startIndex, endIndex);

    const totalItems = findAllSareeStock.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1
        ? "matching saree stock is"
        : "matchings saree stock are.";

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

exports.editSareeStock = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const matchingId = req.params.matchingId;
    const editSareeStock = await sareeStockService.editSareeStock(
      tokenId,
      matchingId,
      req.body.returnPcs
    );
    res.status(editSareeStock.status).send(editSareeStock);
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

exports.slaeSareeStock = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const matchingId = req.params.matchingId;
    const saleSareeDetails = {
      date: new Date(),
      party: req.body.party,
      design: req.body.design,
      pallu: req.body.pallu,
      groundColor: req.body.groundColor,
      salePcs: req.body.salePcs,
      matchingId: matchingId,
      tokenId: tokenId,
    };
    const saleStock = await sareeStockService.saleSareeStock(
      tokenId,
      matchingId,
      saleSareeDetails
    );
    res.status(saleStock.status).send(saleStock);
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

const sareeStockService = require("../../service/stock/sareeStock.service");

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

exports.getSareeStock = async (req, res) => {
  try {
    const findAllSareeStock = await sareeStockService.getSareeStock();

    if (!Array.isArray(findAllSareeStock)) {
      return res.status(findAllSareeStock.status).send(findAllSareeStock);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findAllSareeStock.length;
    const status =
      totalItems === 1
        ? "matching saree stock is"
        : "matchings saree stock are.";

    const response = buildPagedResponse(
      findAllSareeStock,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
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
    return res.status(editSareeStock.status).send(editSareeStock);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.slaeSareeStock = async (req, res) => {
  try {
    const tokenId = req.params.tokenId;
    const matchingId = req.params.matchingId;
    const currentDate = new Date();

    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // January is 0!
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    const saleSareeDetails = {
      date: formattedDate,
      party: req.body.party,
      design: req.body.design,
      pallu: req.body.pallu,
      groundColor: req.body.groundColor,
      stock: req.body.stock,
      matchingId: matchingId,
      tokenId: tokenId,
    };
    const saleStock = await sareeStockService.saleSareeStock(
      tokenId,
      matchingId,
      saleSareeDetails
    );
    return res.status(saleStock.status).send(saleStock);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.listSaleSaree = async (req, res) => {
  try {
    const findAllSareeStock = await sareeStockService.listSaleSaree();

    if (!Array.isArray(findAllSareeStock)) {
      return res.status(findAllSareeStock.status).send(findAllSareeStock);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findAllSareeStock.length;
    const status =
      totalItems === 1
        ? "sale saree is"
        : "sale saree are.";

    const response = buildPagedResponse(
      findAllSareeStock,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

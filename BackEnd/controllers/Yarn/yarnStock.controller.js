const yarnStockService = require("../../service/Yarn/yarnStock.service");

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

exports.findYarnStock = async (req, res) => {
  try {
    const findYarnStock = await yarnStockService.findYarnStock();

    if (!Array.isArray(findYarnStock)) {
      return res.status(findYarnStock.status).send(findYarnStock);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findYarnStock.length;
    const status = totalItems === 1 ? "YarnStock" : "YarnStocks";

    const response = buildPagedResponse(
      findYarnStock,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findRemainingYarnStock = async (req, res) => {
  try {
    const findYarnStock = await yarnStockService.findRemainingYarnStock();
 
    if (!Array.isArray(findYarnStock)) {
      return res.status(findYarnStock.status).send(findYarnStock);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findYarnStock.length;
    const status = totalItems === 1 ? "YarnStock" : "YarnStocks";

    const response = buildPagedResponse(
      findYarnStock,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );

    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

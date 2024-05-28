const yarnStockService = require("../../service/Yarn/yarnStock.service");

exports.findYarnStock = async (req, res) => {
  try {
    const findYarnStock = await yarnStockService.findYarnStock();

    if (!Array.isArray(findYarnStock)) {
      return res.status(findYarnStock.status).send(findYarnStock);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findYarnStock;
    // .slice(startIndex, endIndex);

    const totalItems = findYarnStock.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnStock" : "YarnStocks";

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

exports.findRemainingYarnStock = async (req, res) => {
  try {
    const findYarnStock = await yarnStockService.findRemainingYarnStock();
 
    if (!Array.isArray(findYarnStock)) {
      return res.status(findYarnStock.status).send(findYarnStock);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findYarnStock;
    // .slice(startIndex, endIndex);

    const totalItems = findYarnStock.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnStock" : "YarnStocks";

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

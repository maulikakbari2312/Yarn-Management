const yarnSalesService = require("../../service/Yarn/yarnSales.service");

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

exports.createYarnSales = async (req, res) => {
  try {
    const yarnSalesData = await yarnSalesService.createYarnSales(req.body);

    if (!yarnSalesData) {
      throw new Error("Please enter valid yarnSales information!");
    }

    return res.status(yarnSalesData.status).send(yarnSalesData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getYarnSales = async (req, res) => {
  try {
    const findYarnSales = await yarnSalesService.findYarnSales();

    if (!Array.isArray(findYarnSales)) {
      return res.status(findYarnSales.status).send(findYarnSales);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findYarnSales.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnSales" : "YarnSales";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: findYarnSales,
      message: `Total ${totalItems} ${status} available`,
    };
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editYarnSales = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editYarnSalesData = await yarnSalesService.editYarnSalesDetail(
      req.body,
      token
    );

    return res.status(editYarnSalesData.status).send(editYarnSalesData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteYarnSales = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteYarnSalesData = await yarnSalesService.deleteYarnSalesDetail(
      token
    );

    return res.status(deleteYarnSalesData.status).send(deleteYarnSalesData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

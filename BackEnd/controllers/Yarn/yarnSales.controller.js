const yarnSalesService = require("../../service/Yarn/yarnSales.service");

exports.createYarnSales = async (req, res) => {
  try {
    const yarnSalesData = await yarnSalesService.createYarnSales(req.body);

    if (!yarnSalesData) {
      throw new Error("Please enter valid yarnSales information!");
    }

    res.status(yarnSalesData.status).send(yarnSalesData);
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

exports.getYarnSales = async (req, res) => {
  try {
    const findYarnSales = await yarnSalesService.findYarnSales();

    if (!Array.isArray(findYarnSales)) {
      return res.status(findYarnSales.status).send(findYarnSales);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findYarnSales;
    // .slice(startIndex, endIndex);

    const totalItems = findYarnSales.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "YarnSales" : "YarnSales";

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

exports.editYarnSales = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const editYarnSalesData = await yarnSalesService.editYarnSalesDetail(
      req.body,
      token
    );

    res.status(editYarnSalesData.status).send(editYarnSalesData);
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

exports.deleteYarnSales = async (req, res) => {
  try {
    const token = req.params.tokenId;
    const deleteYarnSalesData = await yarnSalesService.deleteYarnSalesDetail(
      token
    );

    res.status(deleteYarnSalesData.status).send(deleteYarnSalesData);
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

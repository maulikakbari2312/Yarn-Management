const orderStockService = require("../../service/stock/orderStock.service");

exports.getOrderStock = async (req, res) => {
  try {
    const findAllOrderStock = await orderStockService.getOrderStock();

    if (!Array.isArray(findAllOrderStock)) {
      return res.status(findAllOrderStock.status).send(findAllOrderStock);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllOrderStock.slice(startIndex, endIndex);

    const totalItems = findAllOrderStock.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "matching saree stock is" : "matchings saree stocks are";

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

exports.getListOfOrders = async (req, res) => {
  try {
    const findListOfOrders = await orderStockService.getListOfOrders();

    if (!Array.isArray(findListOfOrders)) {
      return res.status(findListOfOrders.status).send(findListOfOrders);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findListOfOrders.slice(startIndex, endIndex);

    const totalItems = findListOfOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "order is" : "orders are";

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

exports.getListOfOrderDesign = async (req, res) => {
  try {
    const orderNo = req.query.orderNo;
    const findListOfOrderDesign = await orderStockService.getListOfOrderDesign(orderNo);

    if (!Array.isArray(findListOfOrderDesign)) {
      return res.status(findListOfOrderDesign.status).send(findListOfOrderDesign);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findListOfOrderDesign.slice(startIndex, endIndex);

    const totalItems = findListOfOrderDesign.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "design is" : "designs are";

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

exports.getsareeYarn = async (req, res) => {
  try {
    const orderNo = req.query.orderNo;
    const design = req.query.design
    const sareeYarn = await orderStockService.getsareeYarn(orderNo, design);
    if (!Array.isArray(sareeYarn?.pageItems)) {
      return res.status(sareeYarn?.pageItems.status).send(sareeYarn?.pageItems);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = sareeYarn?.pageItems.slice(startIndex, endIndex);

    const totalItems = sareeYarn?.pageItems.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "design is" : "designs are";

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
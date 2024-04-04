const processOrdersService = require("../../service/Order/processOrders.service");

exports.createProcessOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const tokenId = req.params.tokenId;

    const body = req.body;
    const findAllOrders = await processOrdersService.createProcessOrder(
      orderId,
      tokenId,
      body
    );
    res.status(findAllOrders.status).send(findAllOrders);
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

exports.getProcessOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const findAllProcessOrders = await processOrdersService.getProcessOrder(
      orderId
    );

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllProcessOrders.slice(startIndex, endIndex);

    const totalItems = findAllProcessOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "order" : "orders";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} proceess pending`,
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

exports.getAllProcessOrder = async (req, res) => {
  try {
    const findAllProcessOrders =
      await processOrdersService.getAllProcessOrder();

    if (!Array.isArray(findAllProcessOrders)) {
      return res.status(findAllProcessOrders.status).send(findAllProcessOrders);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllProcessOrders.slice(startIndex, endIndex);

    const totalItems = findAllProcessOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "order is inProcess" : "orders are inProcess";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} proceess pending`,
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

exports.deleteAllProcessOrder = async (req, res) => {
  try {
    const { orderId, tokenId, machineId } = req.params;
    const deleteProcessorders =
      await processOrdersService.deleteAllProcessOrder(
        orderId,
        tokenId,
        machineId
      );

    if (!Array.isArray(deleteProcessorders)) {
      return res.status(deleteProcessorders.status).send(deleteProcessorders);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = deleteProcessorders.slice(startIndex, endIndex);

    const totalItems = deleteProcessorders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "order is inProcess" : "orders are inProcess";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} proceess pending`,
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
const completeOrdersService = require("../../service/Order/completeOrders.service");

exports.completeProcessOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const tokenId = req.params.tokenId;
    const machineId = req.params.machineId;
    const complete = req.body.isComplete;
    const makeOrderComplete = await completeOrdersService.completeProcessOrder(
      orderId,
      tokenId,
      machineId,
      complete
    );
    res.status(makeOrderComplete.status).send(makeOrderComplete);
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

exports.getCompleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const findAllProcessOrders = await completeOrdersService.getCompleteOrder(
      orderId
    );

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
      totalItems === 1 ? "order is completed" : "orders are completed.";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status}`,
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

exports.createCompleteOrder = async (req, res) => {
  try {
    const { orderId, tokenId } = req.params;
    const data = req.body;
    const completeOrder = await completeOrdersService.createCompleteOrder(
      orderId,
      tokenId,
      data
    );
    res.status(completeOrder.status).send(completeOrder);
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

exports.getDeliveredOrder = async (req, res) => {
  try {
    const findAllDeliveredOrders =
      await completeOrdersService.getDeliveredOrder();

    if (!Array.isArray(findAllDeliveredOrders)) {
      return res
        .status(findAllDeliveredOrders.status)
        .send(findAllDeliveredOrders);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllDeliveredOrders.slice(startIndex, endIndex);

    const totalItems = findAllDeliveredOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "order is delivered." : "orders are delivered";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status}`,
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

exports.getAllCompleteOrder = async (req, res) => {
  try {
    const findAllCompleteOrders =
      await completeOrdersService.getAllCompleteOrder();

    if (!Array.isArray(findAllCompleteOrders)) {
      return res
        .status(findAllCompleteOrders.status)
        .send(findAllCompleteOrders);
    }

    const limit = parseInt(req.query.limit) || 1000 ;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findAllCompleteOrders.slice(startIndex, endIndex);

    const totalItems = findAllCompleteOrders.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status =
      totalItems === 1 ? "order is completed." : "orders are completed.";

    const response = {
      page: offset + 1,
      totalPages,
      itemsPerPage: limit,
      total: totalItems,
      pageItems: pageItems,
      message: `Total ${totalItems} ${status} `,
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

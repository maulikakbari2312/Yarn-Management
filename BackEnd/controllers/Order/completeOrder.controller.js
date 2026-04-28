const completeOrdersService = require("../../service/Order/completeOrders.service");

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
    return res.status(makeOrderComplete.status).send(makeOrderComplete);
  } catch (error) {
    return handleControllerError(error, res);
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

    const { limit, offset } = getPagination(req);

    const totalItems = findAllProcessOrders.length;
    const status =
      totalItems === 1 ? "order is completed" : "orders are completed.";

    const response = buildPagedResponse(
      findAllProcessOrders,
      limit,
      offset,
      `Total ${totalItems} ${status}`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
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
    return res.status(completeOrder.status).send(completeOrder);
  } catch (error) {
    return handleControllerError(error, res);
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

    const { limit, offset } = getPagination(req);

    const totalItems = findAllDeliveredOrders.length;
    const status =
      totalItems === 1 ? "order is delivered." : "orders are delivered";

    const response = buildPagedResponse(
      findAllDeliveredOrders,
      limit,
      offset,
      `Total ${totalItems} ${status}`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
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

    const { limit, offset } = getPagination(req);

    const totalItems = findAllCompleteOrders.length;
    const status =
      totalItems === 1 ? "order is completed." : "orders are completed.";

    const response = buildPagedResponse(
      findAllCompleteOrders,
      limit,
      offset,
      `Total ${totalItems} ${status} `
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

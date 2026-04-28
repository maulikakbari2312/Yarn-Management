const processOrdersService = require("../../service/Order/processOrders.service");

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
    return res.status(findAllOrders.status).send(findAllOrders);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getProcessOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const findAllProcessOrders = await processOrdersService.getProcessOrder(
      orderId
    );

    const { limit, offset } = getPagination(req);

    const totalItems = findAllProcessOrders.length;
    const status = totalItems === 1 ? "order" : "orders";

    const response = buildPagedResponse(
      findAllProcessOrders,
      limit,
      offset,
      `Total ${totalItems} ${status} proceess pending`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getAllProcessOrder = async (req, res) => {
  try {
    const findAllProcessOrders =
      await processOrdersService.getAllProcessOrder();

    if (!Array.isArray(findAllProcessOrders)) {
      return res.status(findAllProcessOrders.status).send(findAllProcessOrders);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findAllProcessOrders.length;
    const status =
      totalItems === 1 ? "order is inProcess" : "orders are inProcess";

    const response = buildPagedResponse(
      findAllProcessOrders,
      limit,
      offset,
      `Total ${totalItems} ${status} proceess pending`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
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

    const { limit, offset } = getPagination(req);

    const totalItems = deleteProcessorders.length;
    const status =
      totalItems === 1 ? "order is inProcess" : "orders are inProcess";

    const response = buildPagedResponse(
      deleteProcessorders,
      limit,
      offset,
      `Total ${totalItems} ${status} proceess pending`
    );

    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editAllProcessOrder = async (req, res) => {
  try {
    const { orderId, tokenId, machineId } = req.params;
    const body = req.body;
    const editProcessorders = await processOrdersService.editAllProcessOrder(
      orderId,
      tokenId,
      machineId,
      body?.pcsOnMachine
    );

    return res.status(editProcessorders.status).send(editProcessorders);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
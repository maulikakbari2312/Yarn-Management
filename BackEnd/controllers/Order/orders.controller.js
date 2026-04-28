const ordersService = require("../../service/Order/orders.service");
const utils = require("../../common/utils");
const salesYarnModel = require("../../model/Yarn/yarnSales.model")

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

exports.createOrderId = async (req, res) => {
  try {
    const ordersIdData = await ordersService.createOrderId();

    return res.status(ordersIdData.status).send(ordersIdData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.createOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const ordersData = await ordersService.createOrders(req.body, orderId);

    if (!ordersData) {
      throw new Error("Please enter valid Orders information!");
    }

    return res.status(ordersData.status).send(ordersData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getMatchingFeeder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findMatching = await ordersService.findMatchingFeeder(
      orderId
    );

    return res.status(findMatching.status).send(findMatching);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findOrderById = async (req, res) => {
  try {
    const findByOrderId = await ordersService.findOrderById();

    if (!Array.isArray(findByOrderId)) {
      return res.status(findByOrderId.status).send(findByOrderId);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findByOrderId.length;
    const status = totalItems === 1 ? "order" : "orders";

    const response = buildPagedResponse(
      findByOrderId,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findAllOrders = await ordersService.findOrders(orderId);
    return res.status(findAllOrders.status).send(findAllOrders);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.editOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const token = req.params.tokenId;
    const editOrdersData = await ordersService.editOrdersDetail(
      req.body,
      orderId,
      token
    );
    return res.status(editOrdersData.status).send(editOrdersData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId, tokenId } = req.params;
    const deleteordersData = await ordersService.deleteOrder(orderId, tokenId);

    return res.status(deleteordersData.status).send(deleteordersData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.deleteWholeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleteordersData = await ordersService.deleteWholeOrder(orderId);

    return res.status(deleteordersData.status).send(deleteordersData);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.totalMatching = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findTotalMatching = await ordersService.totalMatching(orderId);

    return res.status(findTotalMatching.status).send(findTotalMatching);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.findMatching = async (req, res) => {
  try {
    const design = req.body.design;
    const findMatchingByDesign = await ordersService.findMatching(design);

    if (!Array.isArray(findMatchingByDesign)) {
      return res.status(findMatchingByDesign.status).send(findMatchingByDesign);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findMatchingByDesign.length;
    const status = totalItems === 1 ? "matching is" : "matchings are";

    const response = buildPagedResponse(
      findMatchingByDesign,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
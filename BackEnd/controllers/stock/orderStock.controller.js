const orderStockService = require("../../service/stock/orderStock.service");

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

exports.getOrderStock = async (req, res) => {
  try {
    const findAllOrderStock = await orderStockService.getOrderStock();

    if (!Array.isArray(findAllOrderStock)) {
      return res.status(findAllOrderStock.status).send(findAllOrderStock);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findAllOrderStock.length;
    const status =
      totalItems === 1 ? "matching saree stock is" : "matchings saree stocks are";

    const response = buildPagedResponse(
      findAllOrderStock,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getListOfOrders = async (req, res) => {
  try {
    const findListOfOrders = await orderStockService.getListOfOrders();

    if (!Array.isArray(findListOfOrders)) {
      return res.status(findListOfOrders.status).send(findListOfOrders);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findListOfOrders.length;
    const status =
      totalItems === 1 ? "order is" : "orders are";

    const response = buildPagedResponse(
      findListOfOrders,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getListOfOrderDesign = async (req, res) => {
  try {
    const orderNo = req.query.orderNo;
    const findListOfOrderDesign = await orderStockService.getListOfOrderDesign(orderNo);

    if (!Array.isArray(findListOfOrderDesign)) {
      return res.status(findListOfOrderDesign.status).send(findListOfOrderDesign);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = findListOfOrderDesign.length;
    const status =
      totalItems === 1 ? "design is" : "designs are";

    const response = buildPagedResponse(
      findListOfOrderDesign,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );
    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};

exports.getsareeYarn = async (req, res) => {
  try {
    const orderNo = req.query.orderNo;
    const design = req.query.design;
    const sareeYarn = await orderStockService.getsareeYarn(orderNo, design);
    if (!Array.isArray(sareeYarn?.pageItems)) {
      return res.status(sareeYarn?.pageItems.status).send(sareeYarn?.pageItems);
    }

    const { limit, offset } = getPagination(req);

    const totalItems = sareeYarn?.pageItems.length;
    const status =
      totalItems === 1 ? "design is" : "designs are";

    const response = buildPagedResponse(
      sareeYarn.pageItems,
      limit,
      offset,
      `Total ${totalItems} ${status} available`
    );

    return res.status(200).send(response);
  } catch (error) {
    return handleControllerError(error, res);
  }
};
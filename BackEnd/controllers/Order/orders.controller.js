const ordersService = require("../../service/Order/orders.service");
const utils = require("../../common/utils");
const salesYarnModel = require("../../model/Yarn/yarnSales.model")

exports.createOrderId = async (req, res) => {
  try {
    const ordersIdData = await ordersService.createOrderId();

    res.status(ordersIdData.status).send(ordersIdData);
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

exports.createOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const ordersData = await ordersService.createOrders(req.body, orderId);

    if (!ordersData) {
      throw new Error("Please enter valid Orders information!");
    }

    res.status(ordersData.status).send(ordersData);
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

exports.getMatchingFeeder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findMatching = await ordersService.findMatchingFeeder(
      orderId
    );

    res.status(findMatching.status).send(findMatching);
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

exports.findOrderById = async (req, res) => {
  try {
    const findByOrderId = await ordersService.findOrderById();

    if (!Array.isArray(findByOrderId)) {
      return res.status(findByOrderId.status).send(findByOrderId);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findByOrderId.slice(startIndex, endIndex);

    const totalItems = findByOrderId.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "order" : "orders";

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

exports.findOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findAllOrders = await ordersService.findOrders(orderId);
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

exports.editOrders = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const token = req.params.tokenId;
    const editOrdersData = await ordersService.editOrdersDetail(
      req.body,
      orderId,
      token
    );
    utils.responseWithJsonBody(
      res,
      editOrdersData.status,
      editOrdersData,
      req.headers
    );
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

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId, tokenId } = req.params;
    const deleteordersData = await ordersService.deleteOrder(orderId, tokenId);

    res.status(deleteordersData.status).send(deleteordersData);
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

exports.deleteWholeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deleteordersData = await ordersService.deleteWholeOrder(orderId);

    res.status(deleteordersData.status).send(deleteordersData);
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

exports.totalMatching = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const findTotalMatching = await ordersService.totalMatching(orderId);

    res.status(findTotalMatching.status).send(findTotalMatching);
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

exports.findMatching = async (req, res) => {
  try {
    const design = req.body.design;
    const findMatchingByDesign = await ordersService.findMatching(design);

    if (!Array.isArray(findMatchingByDesign)) {
      return res.status(findMatchingByDesign.status).send(findMatchingByDesign);
    }

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const startIndex = offset * limit;
    const endIndex = startIndex + limit;
    const pageItems = findMatchingByDesign.slice(startIndex, endIndex);

    const totalItems = findMatchingByDesign.length;
    const totalPages = Math.ceil(totalItems / limit);
    const status = totalItems === 1 ? "matching is" : "matchings are";

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
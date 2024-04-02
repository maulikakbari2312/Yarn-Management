const router = require("express").Router();
const sareeStockController = require("../../controllers/stock/sareeStock.controller");

router.get("/getSareeStock",sareeStockController.getSareeStock);

module.exports = router;
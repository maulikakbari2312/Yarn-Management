const router = require("express").Router();
const orderStockController = require("../../controllers/stock/orderStock.controller");

router.get("/getOrderStock", orderStockController.getOrderStock);
router.get("/listOfOrders", orderStockController.getListOfOrders);
router.get("/listOfOrderDesign", orderStockController.getListOfOrderDesign);
router.get("/orderYarnStock", orderStockController.getsareeYarn);

module.exports = router;
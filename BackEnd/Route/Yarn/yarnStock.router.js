const router = require("express").Router();
const yarnStockController = require("../../controllers/Yarn/yarnStock.controller");

router.get("/findYarnStock", yarnStockController.findYarnStock);
router.get("/findRemainYarnStock", yarnStockController.findRemainingYarnStock);

module.exports = router;
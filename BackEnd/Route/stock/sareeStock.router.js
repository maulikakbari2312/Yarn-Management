const router = require("express").Router();
const sareeStockController = require("../../controllers/stock/sareeStock.controller");

router.get("/getSareeStock",sareeStockController.getSareeStock);
router.put("/editSareeStock/:tokenId/:matchingId",sareeStockController.editSareeStock);

module.exports = router;
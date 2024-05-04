const router = require("express").Router();
const sareeStockController = require("../../controllers/stock/sareeStock.controller");

router.get("/getSareeStock",sareeStockController.getSareeStock);
router.put("/editSareeStock/:tokenId/:matchingId",sareeStockController.editSareeStock);
router.post("/saleSareeStock/:tokenId/:matchingId",sareeStockController.slaeSareeStock);


module.exports = router;
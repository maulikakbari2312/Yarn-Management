const router = require("express").Router();
const sareeStockController = require("../../controllers/stock/sareeStock.controller");

router.get("/getSareeStock",sareeStockController.getSareeStock);
router.put("/editSareeStock/:tokenId/:matchingId",sareeStockController.editSareeStock);
router.post("/saleSareeStock/:tokenId/:matchingId",sareeStockController.slaeSareeStock);
router.get("/getSaleSaree",sareeStockController.listSaleSaree)


module.exports = router;
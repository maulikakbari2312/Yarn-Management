const router = require("express").Router();
const yarnSalesController = require("../../controllers/Yarn/yarnSales.controller");

router.post("/createYarnSales", yarnSalesController.createYarnSales);
router.get("/findYarnSales", yarnSalesController.getYarnSales);
router.put("/editYarnSales/:tokenId", yarnSalesController.editYarnSales);
router.delete("/deleteYarnSales/:tokenId", yarnSalesController.deleteYarnSales);

module.exports = router;

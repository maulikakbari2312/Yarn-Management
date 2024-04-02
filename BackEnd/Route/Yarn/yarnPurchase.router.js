const router = require("express").Router();
const yarnPurchaseController = require("../../controllers/Yarn/yarnPurchase.controller");

router.post("/createYarnPurchase", yarnPurchaseController.createYarnPurchase);
router.get("/findYarnPurchase", yarnPurchaseController.getYarnPurchase);
router.put("/editYarnPurchase/:tokenId", yarnPurchaseController.editYarnPurchase);
router.delete("/deleteYarnPurchase/:tokenId", yarnPurchaseController.deleteYarnPurchase);

module.exports = router;

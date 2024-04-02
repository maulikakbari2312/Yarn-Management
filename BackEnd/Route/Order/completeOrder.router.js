const router = require("express").Router();
const completeOrdersController = require("../../controllers/Order/completeOrder.controller");


router.post("/makeOrderComplete/:orderId/:tokenId/:machineId",completeOrdersController.completeProcessOrder);
router.get("/getCompleteOrder/:orderId",completeOrdersController.getCompleteOrder);
router.post("/createCompleteOrder/:orderId/:tokenId",completeOrdersController.createCompleteOrder);
router.get("/getDeliveredOrder",completeOrdersController.getDeliveredOrder);
router.get("/getAllCompleteOrder",completeOrdersController.getAllCompleteOrder);


module.exports = router;

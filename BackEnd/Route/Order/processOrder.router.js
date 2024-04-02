const router = require("express").Router();
const processOrdersController = require("../../controllers/Order/processOrder.controller");


router.post("/createProcessOrder/:orderId/:tokenId",processOrdersController.createProcessOrder);
router.get("/getProcessOrder/:orderId",processOrdersController.getProcessOrder);
router.get("/getAllProcessOrder",processOrdersController.getAllProcessOrder);
router.delete("/deleteProcessOrder/:orderId/:tokenId/:machineId",processOrdersController.deleteAllProcessOrder);



module.exports = router;
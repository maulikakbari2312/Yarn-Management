const router = require("express").Router();
const OrdersController = require("../../controllers/Order/orders.controller");

router.post("/createToken", OrdersController.createOrderId);
router.post("/createOrders/:orderId", OrdersController.createOrders);
router.post("/findMatching/:orderId", OrdersController.getMatchingFeeder);
router.put("/editOrders/:orderId/:tokenId", OrdersController.editOrders);
router.delete("/deleteOrders/:orderId/:tokenId", OrdersController.deleteOrder);
router.get("/findOrders", OrdersController.findOrderById);
router.post("/findAllOrders/:orderId", OrdersController.findOrders);
router.delete("/deleteWholeOrder/:orderId", OrdersController.deleteWholeOrder);
router.get("/totalMatching/:orderId", OrdersController.totalMatching);
router.post("/findMatching", OrdersController.findMatching);


module.exports = router;

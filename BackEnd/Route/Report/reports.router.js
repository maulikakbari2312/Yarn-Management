const router = require("express").Router();
const designController = require("../../controllers/Report/design.controllers");
const machineReportController = require("../../controllers/Report/machineReport.controller");
const partyOrderController = require("../../controllers/Report/partyOrder.controller")


router.post("/findReportDesign", designController.getReportDesign);
router.get("/findMachineReport", machineReportController.getMachineReport);
router.get("/getOrderByParty",partyOrderController.getPartyOrder );
router.get("/findPartyDesign",partyOrderController.findPartyDesign);


module.exports = router;
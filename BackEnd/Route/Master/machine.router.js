const router = require("express").Router();
const machineController = require("../../controllers/Master/machine.controller");

router.post("/createMachine", machineController.createMachine);
router.get("/findMachine", machineController.getMachine);
router.put("/editMachine/:tokenId", machineController.editMachine);
router.delete("/deleteMachine/:tokenId", machineController.deleteMachine);
module.exports = router;

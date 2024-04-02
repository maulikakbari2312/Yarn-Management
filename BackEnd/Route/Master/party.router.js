const router = require("express").Router();
const partyController = require("../../controllers/Master/party.controller");

router.post("/createParty", partyController.createParty);
router.get("/findParty", partyController.getParty);
router.put("/editParty/:tokenId", partyController.editParty);
router.delete("/deleteParty/:tokenId", partyController.deleteParty);
module.exports = router;

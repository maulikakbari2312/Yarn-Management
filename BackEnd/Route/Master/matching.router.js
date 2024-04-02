const router = require("express").Router();
const matchingController = require("../../controllers/Master/matching.controller");

router.post("/createMatching", matchingController.createMatching);
router.get("/findMatchingColor", matchingController.getColorMatching);
router.get("/findDesign", matchingController.getDesignMatching);
router.post("/listOfMatching", matchingController.matchingList);
router.put("/editMatching/:tokenId", matchingController.editMatching);
router.delete("/deleteMatching/:tokenId", matchingController.deleteMatching);
router.post("/findGroundColor", matchingController.findGroundColor);

module.exports = router;
const router = require("express").Router();
const colorYarnController = require("../../controllers/Master/colorYarn.controller");

router.post("/createColorYarn", colorYarnController.createColorYarn);
router.get("/findColorYarn", colorYarnController.getColorYarn);
router.put("/editColorYarn/:tokenId", colorYarnController.editColorYarn);
router.delete("/deleteColorYarn/:tokenId", colorYarnController.deleteColorYarn);
router.post("/findColorCode", colorYarnController.getColorCode);

module.exports = router;

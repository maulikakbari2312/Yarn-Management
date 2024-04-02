const router = require("express").Router();
const designController = require("../../controllers/Master/design.controller");
const commonUpload = require("../../common/utils")

router.post("/createDesign", commonUpload.upload, designController.createDesign);
router.get("/findDesign", designController.getDesign);
router.put("/editDesign/:tokenId",commonUpload.upload, designController.editDesign);
router.delete("/deleteDesign/:tokenId", designController.deleteDesign);
router.get("/photo/:image", designController.getImage);


module.exports = router;
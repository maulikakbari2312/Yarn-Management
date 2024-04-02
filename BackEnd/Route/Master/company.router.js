const router = require("express").Router();
const companyController = require("../../controllers/Master/company.controller");

router.post("/createCompany", companyController.createCompany);
router.get("/findCompany", companyController.getCompany);
router.put("/editCompany/:tokenId", companyController.editCompany);
router.delete("/deleteCompany/:tokenId", companyController.deleteCompany);

module.exports = router;

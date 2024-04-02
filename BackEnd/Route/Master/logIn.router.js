const router = require("express").Router();
const logInController = require("../../controllers/Master/login.controller");

router.post("/signUp", logInController.signUp);
router.get("/UserList", logInController.getUsers);
router.post("/logIn", logInController.logIn);
router.put("/editUserList/:tokenId", logInController.editUser);
router.delete("/deleteUserList/:tokenId", logInController.deleteUser);

module.exports = router;

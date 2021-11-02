const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auth = require("../../middlewares/auth")

router.get("", auth.isAuth, auth.isAdmin, userController.getAllUsers);
router.post('/logout', auth.isAuth, userController.logout);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/role/:role', auth.isAuth, auth.isAdmin, userController.getSpecificUsers);

module.exports = router;
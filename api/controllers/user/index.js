const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auth = require("../../middlewares/auth")

router.post('/logout', auth.isAuth, userController.logout);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get("/users", auth.isAuth, auth.isAdmin, userController.getAllUsers);
router.get('/users/:role', auth.isAuth, auth.isAdmin, userController.getSpecificUsers);

module.exports = router;
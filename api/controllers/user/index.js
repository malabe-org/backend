const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auhtMiddleware = require("../../middlewares/auth")

router.post('/logout', auhtMiddleware.isAuth, userController.logout);
router.post('/login', userController.login);
router.post('/signup', userController.signup);

module.exports = router;
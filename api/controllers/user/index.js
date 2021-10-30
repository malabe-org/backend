const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auhtMiddleware = require("../../middlewares/auth")

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/logout', userController.logout);

module.exports = router;
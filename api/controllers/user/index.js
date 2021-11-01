const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middlewares/auth")

router.post('/logout', authMiddleware.isAuth, userController.logout);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.get('/users/:role', authMiddleware.isAuth, userController.getSpecificUsers);

module.exports = router;
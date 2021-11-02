const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const auth = require("../../middlewares/auth")

router.get("", auth.isAuth, auth.isAdmin, userController.getAllUsers);
router.get("/me", auth.isAuth, userController.me);
router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/logout", auth.isAuth, userController.logout);
router.put("/update", auth.isAuth, userController.updateUser);
router.put("/update/:id", auth.isAuth, userController.updateUserWithId);
router.get("/role/:role", auth.isAuth, auth.isAdmin, userController.getSpecificUsers);

module.exports = router;
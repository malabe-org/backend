const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const dhHubController = require("./dhHub.controller");

router.get("", auth.isAuth, auth.isAdmin, dhHubController.getAll);
router.post("/create", auth.isAuth, auth.isAdmin, dhHubController.create);


module.exports = router;
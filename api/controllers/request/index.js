const express = require("express");
const router = express.Router();
const multer = require('../../../utils/multer');
const auth = require("../../middlewares/auth")
const { userRoles } = require('../../../config/role');
const requestController = require('./request.controller');
const upload = multer.uploadFile('documents');

router.post("/create", auth.isAuth, auth.isSeeker, upload.any('documents'), requestController.create);
router.get('/for_phuser', auth.isAuth, auth.isPhUser, requestController.getForPhUSer);
router.get('/seeker/:id', auth.isAuth, auth.isSeeker, requestController.getBySeeeker);
router.get('/:id', auth.isAuth, requestController.getById);

module.exports = router;
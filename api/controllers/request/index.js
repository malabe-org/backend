const express = require("express");
const router = express.Router();
const multer = require('../../../utils/multer');
const authMiddleware = require("../../middlewares/auth")
const { userRoles } = require('../../../config/role');
const requestController = require('./request.controller');
const upload = multer.uploadFile('documents');

router.post("/create", upload.any('documents'), requestController.create);
router.get('/for_phuser', authMiddleware.hasRole(userRoles.PHUSER), requestController.getForPhUSer);
router.get('/seeker/:id', authMiddleware.hasRole(userRoles.SEEKER), requestController.getBySeeeker);
router.get('/:id', authMiddleware.isAuth, requestController.getById);

module.exports = router;
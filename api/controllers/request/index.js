const express = require("express");
const router = express.Router();
const multer = require('../../../utils/multer');
const authMiddleware = require("../../middlewares/auth")
const requestController = require('./request.controller');
const upload = multer.uploadFile('documents');

router.post('/create', authMiddleware.isAuth, upload.any('documents'), requestController.create);
router.get('/for_phuser', authMiddleware.isAuth, requestController.getForPhUSer);
router.get('/seeker/:id', requestController.getBySeeeker);
router.get('/:id', requestController.getById);

module.exports = router;
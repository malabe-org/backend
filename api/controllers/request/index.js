const express = require("express");
const router = express.Router();
const multer = require('../../../utils/multer');
const auhtMiddleware = require("../../middlewares/auth")
const requestController = require('./request.controller');
const upload = multer.uploadFile('documents');

router.post('/create', auhtMiddleware.isAuth, upload.any('documents'), requestController.create);
router.get('/:id', requestController.getById);
router.get('/seeker/:id', requestController.getBySeeeker);

module.exports = router;
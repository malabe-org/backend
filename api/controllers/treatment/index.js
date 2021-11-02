const express = require("express");
const router = express.Router();
const treatmentController = require('./treatment.controller');
const authMiddleware = require('../../middlewares/auth');
const { userRoles } = require('../../../config/role');

router.post('/create', authMiddleware.isAuth, treatmentController.createTreatment);
router.get('', treatmentController.getAllTreatments);
router.put('/update/:id', treatmentController.updateTreatment);
router.put('/change_phuser/:id', treatmentController.changePhUserTreatment)

module.exports = router;
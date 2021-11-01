const express = require("express");
const router = express.Router();
const treatmentController = require('./treatment.controller');
const authMiddleware = require('../../middlewares/auth');
const { userRoles } = require('../../../config/role');

router.post('/create', authMiddleware.isAuth, treatmentController.createTreatment);
router.get('', treatmentController.getAllTreatments);
router.put('/update/:id', authMiddleware.hasRole(userRoles.PHUSER), treatmentController.updateTreatment);
router.put('/change_phuser/:id', authMiddleware.hasRole(userRoles.ADMIN), treatmentController.changePhUserTreatment)

module.exports = router;
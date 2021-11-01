const express = require("express");
const router = express.Router();
const treatmentController = require('./treatment.controller');
const authMiddleware = require('../../middlewares/auth')

router.post('/create', treatmentController.createTreatment);
router.get('', treatmentController.getAllTreatments);
router.put('/update/:id', authMiddleware.isAuth, treatmentController.updateTreatment);
router.put('/change_phuser/:id', authMiddleware.isAuth, treatmentController.changePhUserTreatment)

module.exports = router;
const express = require("express");
const router = express.Router();
const treatmentController = require('./treatment.controller');

router.post('/create', treatmentController.createTreatment);

module.exports = router;
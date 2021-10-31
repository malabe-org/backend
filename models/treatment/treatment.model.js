const mongoose = require('mongoose');
const { jwt } = require('jsonwebtoken');

const treatmentSchema = new mongoose.Schema({
    openDate: {
        type: Date,
        default: Date,
        required: true,
    },
    closeDate: {
        type: Date,
        default: Date,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date
    },
    updated_at: {
        type: Date,
        default: Date
    },
})
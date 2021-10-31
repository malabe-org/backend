const mongoose = require('mongoose');
const validator = require('validator').default;
const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../../config');
const { userRoles } = require('../../config/role');

const requestSchema = new mongoose.Schema({
    document: {
        cniDocCopy: {
            type: String,
        },
    },
    created_at: {
        type: Date,
        default: Date
    },
    updated_at: {
        type: Date,
        default: Date
    },
});
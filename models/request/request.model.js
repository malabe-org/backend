const mongoose = require('mongoose');
const validator = require('validator').default;
const { jwtSecretKey } = require('../../config');
const { userRoles } = require('../../config/role');

const requestSchema = new mongoose.Schema({

    seeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    treatment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Treatment",
        index: true,
    },
    documents: {
        cniCopy: {
            type: String,
            required: true,
        },
        receipt: {
            type: String,
            required: true,
        },
        seekerPhoto: {
            type: String,
            required: true,
        }
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

const Request = mongoose.model("Request", requestSchema)

module.exports = Request;
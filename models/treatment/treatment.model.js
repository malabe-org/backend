const mongoose = require('mongoose');
const validator = require('validator').default;

const treatmentSchema = new mongoose.Schema({

    phUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    openDate: {
        type: Date,
        default: Date,
    },
    closeDate: {
        type: Date,
        default: Date,
    },
    decision: {
        type: String,
        enum: ["OK", "No-OK"],
        default: "No-OK",
        validate(value) {
            if (!(value.toLowerCase() == "ok" || value.toLowerCase() == "no-ok")) {
                throw new Error("Gender should be OK or No-OK")
            }
        }
    },
    reason: {
        type: String
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

const Treatment = mongoose.model("Treatment", treatmentSchema)

module.exports = Treatment;
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
    isOpen: {
        type: Boolean,
        default: false
    },
    closeDate: {
        type: Date,
        default: Date,
    },
    decision: {
        type: String,
        enum: ["Untreated", "OK", "No-OK"],
        default: "Untreated",
        validate(value) {
            if (!(value.toLowerCase() == "ok" || value.toLowerCase() == "no-ok" || value.toLowerCase() == "untreated")) {
                throw new Error("Decision should be OK or No-OK")
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
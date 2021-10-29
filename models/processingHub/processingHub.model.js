const mongoose = require('mongoose');

const processingHubSchema = new mongoose.Schema({
    address: {
        region: {
            type: String,
            required: true,
            index: true,
        },
        department: {
            type: String,
            required: true,
            index: true,
        },
        city: {
            type: String,
            required: true,
            index: true,
        }
    }
})

const ProcessingHub = mongoose.model("ProcessingHub", processingHubSchema);

module.exports = ProcessingHub;
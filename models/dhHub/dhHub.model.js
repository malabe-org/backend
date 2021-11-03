const mongoose = require('mongoose');
const validator = require('validator').default;

const dhHubSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        index: true
    },
    location: {
        type: String,
        unique: true,
        index: true,
    },
    address: {
        region: {
            type: String,
            index: true,
        },
        department: {
            type: String,
            index: true,
        },
        city: {
            type: String,
            index: true,
        },

    },

});


const DhHub = mongoose.model("DhHub", dhHubSchema);

module.exports = DhHub;
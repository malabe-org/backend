const mongoose = require('mongoose');
const { mongoUrl } = require('../../config');
const logger = require("../../utils/logger")

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info(`MongoDB connection is OK`)
}).catch(e => {
    logger.error(`MongoDB connection error : ${e}`)
})
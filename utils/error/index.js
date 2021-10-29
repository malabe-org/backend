const logger = require('../logger')


class ErrorHandler extends Error {

    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}


const handleError = async(error, response) => {
    const { statusCode = 400, message } = error;
    logger.error(`--- HANDLEERROR --- statusCode error : ${statusCode} - message error : ${message}`);
    return response.status(statusCode).json({ statusCode, message });
}


module.exports = {
    ErrorHandler,
    handleError
}
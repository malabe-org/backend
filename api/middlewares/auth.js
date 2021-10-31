const jwt = require('jsonwebtoken');
const User = require('../../models/user/user.model');
const { jwtSecretKey } = require('../../config');
const logger = require("../../utils/logger");

const isAuth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', '')
        logger.info({ token })
        const decoded = jwt.verify(token, jwtSecretKey)
        logger.info({ decoded })
        let user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(401).send("Token error")
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        return res.status(401).send({ error })
    }
}

module.exports = {
    isAuth,
}
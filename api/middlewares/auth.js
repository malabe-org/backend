const jwt = require('jsonwebtoken');
const User = require('../../models/user/user.model');
const { jwtSecretKey } = require('../../config');
const logger = require("../../utils/logger");

const isAuth = async(req, res, next) => {
    try {
        const token = await req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtSecretKey)
        let user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
        if (!user) {
            return res.status(401).send("Token error")
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        return res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = {
    isAuth,
}
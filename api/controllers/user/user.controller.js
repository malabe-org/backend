const logger = require("../../../utils/logger");
const User = require("../../../models/user/user.model");
const { handleError } = require("../../../utils/error")


exports.login = async(req, res) => {
    logger.info(`------USER.LOGIN--------BEGIN`);
    try {
        const user = await User.findByCredentials(
            req.body.phone,
            req.body.email,
            req.body.password,
        );
        const token = await user.generateAuthToken();
        logger.info(`------USER.LOGIN--------SUCCESS`);
        res.status(200).send({
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            token,
            isFirstConnection: user.isFirstConnection,
        });
    } catch (error) {
        handleError(error, res)
        return;
    }
}

exports.signup = async(req, res) => {
    logger.info(`------USER.SIGNUP--------BEGIN`);
    try {
        const userExists = await User.findOne({ $or: [{ phone: req.body.phone }, { email: req.body.email }] })
        if (userExists) {
            logger.error(`------USER.SIGNUP--------CONFLICT`);
            return res.status(409).json("An user with this informations exist !")
        }
        const newUser = new User({...req.body })
        await newUser.save();
        const token = await newUser.generateAuthToken();
        logger.info(`------USER.SIGNUP--------SUCCESS`);
        return res.status(201).send({
            userId: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            role: newUser.role,
            token,
            isFirstConnection: newUser.isFirstConnection,
        });

    } catch (error) {
        handleError(error, res);
        return;
    }
}


exports.logout = async(req, res) => {
    logger.info(`-----USER.LOGOUT------- BEGIN`);
    try {
        console.log({ req })
        req.user.tokens = req.user.tokens.filter(
            (token) => {
                token.token !== req.token
            }
        );
        await req.user.save();
        res.send({ message: "User successfully logged out" });
        logger.info(`-- -- - USER.LOGOUT-- -- -- - SUCCESS `);
    } catch (error) {
        handleError(error, res);
        return;
    }
};
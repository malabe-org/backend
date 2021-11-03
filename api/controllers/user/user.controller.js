const logger = require("../../../utils/logger");
const User = require("../../../models/user/user.model");
const { handleError } = require("../../../utils/error");
const { userRoles } = require("../../../config/role");



/*
Get all users
Args:
  req: The request object.
  res: The response object.
Returns:
  An array of all the users in the database.
*/
exports.getAllUsers = async(req, res) => {
    logger.info(`-----USER.GET.ALL.USERS------- BEGIN`);
    try {
        const users = await User.find()
        logger.info(`-----USER.GET.ALL.USERS------- SUCCESS`);
        return res.status(200).send({ users: users })
    } catch (error) {
        handleError(error, res);
        return;
    }
}


/*
The `me` route is a GET request that returns the user's profile.

Args:
  req: The request object.
  res: The response object.
Returns:
  The user object.
*/
exports.me = async(req, res) => {
    logger.info(`-----USER.ME------- BEGIN`);
    const user = req.user.userProfile();
    logger.info(`-----USER.ME------- SUCCESS --USERID: ${user._id}`);
    res.send(user);
};


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


/*
Get specific users
Args:
  req: The request object.
  res: the response object
Returns:
  A list of users with the role of the parameter passed in.
*/

exports.getSpecificUsers = async(req, res) => {
    logger.info(`-----USER.GET.SPECIFIC.USERS------- BEGIN`);
    const role = req.params.role
    try {
        const users = await User.find({ role: role });
        logger.info(`-----USER.GET.SPECIFIC.USERS------- SUCCESS`);
        return res.status(200).send({
            role: role,
            users: users
        })
    } catch (error) {
        handleError(error, res);
        return;
    }
}


/*
The updateUser function is used to update a user's information.

Args:
  req: The request object.
  res: the response object that we use to send back the response to the client.
Returns:
  The user object is being returned.
*/

exports.updateUser = async(req, res) => {
    logger.info(`-----USER.UPDATE.USER------- BEGIN`);
    const userId = req.user._id;
    try {
        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User not found !" })
        const updates = Object.keys(req.body);
        const allowedUpdates = ["firstname", "lastname", "email", "phone", "password", "cni", "isFirstConnection", "dhHub", "address", "matricule"];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) return res.status(409).send({ message: "There are informations that can't be updated !" });
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        logger.info(`-----USER.UPDATE.USER------- SUCCESS`);
        return res.status(201).send({
            message: "User updated successfully !",
            user: user
        });
    } catch (error) {
        handleError(error, res);
        return;
    }
}


/*
We first check if the user exists by using the findById method.

Args:
  req: The request object.
  res: The response object that will be sent back to the client.
Returns:
  The user object is being returned.
*/

exports.updateUserWithId = async(req, res) => {
    logger.info(`-----USER.UPDATE.USER------- BEGIN`);
    const userId = req.params.id;
    try {
        let user = await User.findById(userId)
        if (!user) return res.status(404).send({ message: "User not found !" })
        const updates = Object.keys(req.body);
        const allowedUpdates = ["firstname", "lastname", "email", "phone", "password", "cni", "isFirstConnection", "address"];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
        if (!isValidOperation) return res.status(409).send({ message: "There are informations that can't be updated !" });
        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        logger.info(`-----USER.UPDATE.USER------- SUCCESS`);
        return res.status(201).send({
            message: "User updated successfully !",
            user: user
        });
    } catch (error) {
        handleError(error, res);
        return;
    }
}
const logger = require("../../../utils/logger");
const User = require("../../../models/user/user.model");
const Treatment = require("../../../models/treatment/treatment.model");
const { userRoles } = require('../../../config/role')
const { handleError } = require("../../../utils/error");

exports.createTreatment = async(req, res) => {
    logger.info(`------TREATMENT.CREATE--------BEGIN`);
    try {
        const phUsers = await User.find({ role: userRoles.PHUSER })
        const selectedPhUser = getOnePhUser(phUsers)
        const newTreatment = new Treatment({
            phUser: selectedPhUser._id,
        });
        await newTreatment.save();
        logger.info(`------TREATMENT.CREATE--------SUCCESS`);
        return res.status(201).send({
            message: 'Treatment affected to a phUser successfully!',
            treatment: newTreatment
        });
    } catch (error) {
        handleError(error, res);
        return;
    }
};

exports.getAllTreatments = async(req, res) => {
    logger.info(`------TREATMENT.GET.ALL--------BEGIN`);
    try {
        const treatments = await Treatment.find().populate({ path: 'phUser', select: "firstname lastname email phone " })
        logger.info(`------TREATMENT.GET.ALL--------BEGIN`);
        return res.status(200).send({
            allTreatments: treatments
        })
    } catch (error) {
        handleErrror(error, res)
        return;
    }
};


const getOnePhUser = function(phUserArray) {
    const list = [...phUserArray]
    return list[Math.floor(Math.random() * list.length)];
}
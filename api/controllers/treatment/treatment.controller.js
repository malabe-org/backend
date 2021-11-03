const logger = require("../../../utils/logger");
const User = require("../../../models/user/user.model");
const Treatment = require("../../../models/treatment/treatment.model");
const { userRoles } = require('../../../config/role')
const { handleError } = require("../../../utils/error");
const { getOneElement } = require("../../../utils/helpers");

exports.createTreatment = async(req, res) => {
    logger.info(`------TREATMENT.CREATE--------BEGIN`);
    try {
        const phUsers = await User.find({ role: userRoles.PHUSER })
        const selectedPhUser = getOneElement(phUsers)
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


/*
Args:
  req: The request object.
  res: the response object
Returns:
  An array of all the treatments in the database.
*/
exports.getAllTreatments = async(req, res) => {
    logger.info(`------TREATMENT.GET.ALL--------BEGIN`);
    try {
        const treatments = await Treatment.find().populate({ path: 'phUser', select: "firstname lastname email phone " })
        logger.info(`------TREATMENT.GET.ALL--------SUCCESS`);
        return res.status(200).send({
            allTreatments: treatments
        })
    } catch (error) {
        handleError(error, res)
        return;
    }
};


/*
The updateTreatment function is used to update a treatment.

Args:
  req: The request object.
  res: the response object that we use to send back the response to the client.
Returns:
  The updated treatment.
*/
exports.updateTreatment = async(req, res) => {
    logger.info(`------TREATMENT.UPDATE.TREATMENT--------BEGIN`);
    const treatment_id = req.params.id
    try {
        const treatmentExists = await Treatment.findById(treatment_id)
        if (!treatmentExists) return res.status(400).json("Treatment not found !");
        const allowUpdates = ["decision", "openDate", "closeDate", "reason", "updated_at", "isOpen", "isGiven"];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => allowUpdates.includes(update));
        if (!isValidOperation) return res.status(409).send({ message: "There are informations that can't be modified !" });
        updates.forEach((update) => (treatmentExists[update] = req.body[update]));
        treatmentExists.updated_at = Date.now();
        await treatmentExists.save();
        logger.info(`------TREATMENT.UPDATE.TREATMENT--------SUCCESS`);
        return res.status(201).send({
            message: "Updated successfully",
            treatment: treatmentExists
        })
    } catch (error) {
        handleError(error, res)
        return;
    }
}


/*
We get the treatment id from the url.
We find the treatment by its id.
We get the newPhUser from the request body.
We update the treatment with the newPhUser.
We save the treatment.
We send a response with a message and the treatment.

Args:
  req: The request object.
  res: the response object that we use to send back the response to the client.
Returns:
  The treatment is being returned.
*/

exports.changePhUserTreatment = async(req, res) => {
    logger.info(`------TREATMENT.CHANGE.PHUSER.TREATMENT--------BEGIN`);
    const treatment_id = req.params.id
    try {
        const treatment = await Treatment.findById(treatment_id)
        if (!treatment) return res.status(400).json("Treatment not found !");
        const newPhUser = req.body.newPhUser;
        treatment.phUser = newPhUser;
        treatment.update_at = Date.now();
        await treatment.save();
        logger.info(`------TREATMENT.CHANGE.PHUSER.TREATMENT--------SUCCESS`);
        return res.status(201).send({
            message: "the PHUSER of this has been changed !",
            treatment: treatment
        });
    } catch (error) {
        handleError(error, res)
        return;
    }
}
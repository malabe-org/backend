const logger = require("../../../utils/logger");
const DhHub = require("../../../models/dhHub/dhHub.model");
const { handleError } = require("../../../utils/error");


/*
We create a new DhHub object with the data sent in the request.
We check if a DhHub with the same location already exists.
If it does, we return a 409 status code and an error message.
If it doesn't, we save the new DhHub and return a 201 status code and a success message.

Args:
  req: The request object.
  res: The response object that will be sent back to the client.
Returns:
  The newly created DhHub object.
*/
exports.create = async(req, res) => {
    logger.info(`------DH.UHSER.CREATE--------BEGIN`);
    try {
        const dhHubExists = await DhHub.findOne({ location: req.body.location })
        if (dhHubExists) {
            return res.status(409).send({ message: "A DhHub with this location already exists !" });
        }
        const newDhHub = new DhHub({...req.body })
        await newDhHub.save();
        logger.info(`------DH.UHSER.CREATE--------SUCCESS`);
        return res.status(201).send({
            message: "DhHub created successfully !",
            newDhHUb
        })
    } catch (error) {
        handleError(error, res)
        return;
    }
}


/*
Get all DhHubs.

Args:
  req: The request object.
  res: the response object that will be sent back to the client.
Returns:
  An array of all the DhHubs.
*/
exports.getAll = async(req, res) => {
    logger.info(`------DH.UHSER.GET--------BEGIN`);
    try {
        const allDhHubs = await DhHub.find();
        if (allDhHubs.length == 0) {
            return res.status(400).send({ message: "There is no DhHub !" })
        }
        logger.info(`------DH.UHSER.GET--------SUCCESS`);
        return res.status(200).send({
            dhHubs: allDhHubs
        })
    } catch (error) {
        handleError(error, res);
        return;
    }
}
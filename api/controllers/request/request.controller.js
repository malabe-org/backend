const logger = require("../../../utils/logger");
const Request = require("../../../models/request/request.model");
const User = require("../../../models/user/user.model");
const Treatment = require("../../../models/treatment/treatment.model");
const { userRoles } = require('../../../config/role');
const { handleError } = require("../../../utils/error");

exports.create = async(req, res) => {
    logger.info(`------REQUEST.CREATE--------BEGIN`);
    console.log({ body: req.body })
    console.log('file request ' + req.files)
    const cniCopyPath = `/static/uploads/documents/cni` + req.files.cniFile
    const receiptPath = `/static/uploads/documents/receipt` + req.files.receiptFile
    const seekerPhotoPath = `/static/uploads/documents/seekerPhotos` + req.files.seekerPhoto
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    try {
        const seekerExist = await User.findById(req.body.userId)
        if (!seekerExist) return res.status(400).json('There is no seeker with this id !');
        const newRequest = new Request({
            seeker: req.body.userId,
            documents: {
                cniCopy: cniCopyPath,
                receipt: receiptPath,
                seekerPhoto: seekerPhotoPath
            }
        })
        await newRequest.save()
        logger.info(`------REQUEST.CREATE--------SUCCESS`);
        return res.status(201).send({
            message: 'Request submitted!',
            seeker: newRequest.seeker,
        })
    } catch (error) {
        handleError(error, res)
        return;
    }
}

exports.getById = async(req, res) => {
    logger.info(`------REQUEST.GET.BY.ID--------BEGIN`);
    try {
        const request = await Request
            .findById(req.params.id)
            .populate("seeker", "firstname lastname phone");
        if (!request) return res.status(400).json('No Request Found !')
        logger.info(`------REQUEST.GET.BY.ID--------SUCCESS`);
        return res.status(200).send({ request })
    } catch (error) {
        handleError(error, res);
        return;
    }
};

exports.getBySeeeker = async(req, res) => {
    logger.info(`------REQUEST.GET.BY.SEEKER--------BEGIN`);
    try {
        const request = await Request
            .find({ seeker: req.params.id })
            .populate("seeker", "firstname lastname phone");
        if (!request) return res.status(400).json('There is no request for this seeker !')
        logger.info(`------REQUEST.GET.BY.SEEKER--------SUCCESS`);
        return res.status(200).send({ request })
    } catch (error) {
        handleError(error, res);
        return;
    }
}
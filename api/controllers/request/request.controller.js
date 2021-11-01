const logger = require("../../../utils/logger");
const Request = require("../../../models/request/request.model");
const User = require("../../../models/user/user.model");
const Treatment = require("../../../models/treatment/treatment.model");
const { userRoles } = require('../../../config/role');
const { handleError } = require("../../../utils/error");
const { getOneElement } = require("../../../utils/helpers");


/*
    Create a new treatment for the phUser.
    Create a new request with the treatment and documents.
    Send a 201 response with the new request.
    
    Args:
      req: The request object.
      res: the response object
    Returns:
      The request object.
*/
exports.create = async(req, res) => {
    logger.info(`------REQUEST.CREATE--------BEGIN`);
    // It checks if the files are uploaded or not.
    const cniCopyPath = `/static/uploads/documents/cni` + req.files.cniFile
    const receiptPath = `/static/uploads/documents/receipt` + req.files.receiptFile
    const seekerPhotoPath = `/static/uploads/documents/seekerPhotos` + req.files.seekerPhoto
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    /*
    1. First, it finds all the PH users in the database.
    2. Then, it selects one of them randomly.
    3. Then, it creates a new treatment with the selected PH user.
    4. Then, it creates a new request with the selected PH user.
    5. Finally, it returns the newly created request.
    */
    try {
        const phUsers = await User.find({ role: userRoles.PHUSER })
        if (phUsers.length > 0) {
            const selectedPhUser = await getOneElement(phUsers)
            logger.info(`------TREATMENT.CREATE--------selectedPhUser: ${selectedPhUser._id}`);
            var newTreatment = await new Treatment({ phUser: selectedPhUser._id });
            await newTreatment.save();
            logger.info(`------TREATMENT.CREATE--------SUCCESSFULLY`);
        }
        logger.info(`------REQUEST.CREATION--------BEGIN`);
        const seekerExist = await User.findById(req.user._id)
        if (!seekerExist) return res.status(400).json('There is no seeker with this id !');
        const newRequest = new Request({
            seeker: req.user._id,
            treatment: newTreatment,
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
            request: newRequest,
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


/*
Find all requests for a seeker by seeker id.

Args:
  req: The request object.
  res: the response object
Returns:
  An array of objects containing the request data.
*/
/*
1. First, it’s using the Request model to find all the requests that have the seeker id of the user that is currently logged in.
2. Then, it’s using the populate method to populate the seeker field with the seeker’s firstname, lastname and phone.
3. Finally, it’s sending the request back to the client.
*/
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


/*
Get all requests for a phuser.

Args:
  req: The request object.
  res: the response object
Returns:
  The current request and all requests for the current user.

1. First, it finds all the treatments that are associated with the current phUser.
2. Then, it finds the request associated with each of the treatments.
3. Finally, it returns the first request in the list of requests.
*/
exports.getForPhUSer = async(req, res) => {
    logger.info(`------REQUEST.GET.FOR.PHUSER--------BEGIN`);
    const phUserId = await req.user._id
    var requestList = []
    try {
        const phUserTreatments = await Treatment.find({ phUser: phUserId });
        for (let i = 0; i < phUserTreatments.length; i++) {
            let treatmentRequest = await Request
                .findOne({ treatment: phUserTreatments[i]._id })
                .populate("treatment", "decision openDate closeDate")
                .populate("seeker", "firstname lastname phone email");
            if (treatmentRequest) {
                requestList.push(treatmentRequest)
            }
        }
        logger.info(`------REQUEST.GET.FOR.PHUSER--------SUCCESS`);
        return res.status(200).send({
            currentRequest: requestList[0],
            allRequests: requestList,
        })
    } catch (error) {
        handleError(error, res);
        return;
    }
}
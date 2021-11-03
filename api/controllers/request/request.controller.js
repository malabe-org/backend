const logger = require("../../../utils/logger");
const Request = require("../../../models/request/request.model");
const User = require("../../../models/user/user.model");
const Treatment = require("../../../models/treatment/treatment.model");
const DhHub = require("../../../models/dhHub/dhHub.model");
const { userRoles } = require('../../../config/role');
const { handleError } = require("../../../utils/error");
const { intersectionArray, differenceArray, getOneElement } = require("../../../utils/helpers");


/*
    Create a new treatment for the phUser.
    Create a new request with the treatment and documents.
    Send a 201 response with the new request.
        1. Find all PH users that have no untreated request
        2. Find all PH users that have untreated request
        3. Find all requests that are untreated
        4. Priority => condition 1 = Select a PH user that has no untreated request
        5. if condition 1 is not completed => Select a PH user that has untreated request
        6. Create a new treatment object
        7. It creates a new Request object and passes in the seeker, treatment, and documents.
        8. It saves the new Request object to the database.
        9. It returns a 201 status code and sends the new Request object back to the client.
Args:
    req: The request object.
res: the response object
Returns:
    The request object.
*/
exports.create = async(req, res) => {
    logger.info(`------REQUEST.CREATE--------BEGIN`);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    const cniCopyPath = `/static/uploads/documents/` + req.files[0].filename
    const receiptPath = `/static/uploads/documents/` + req.files[1].filename
    const seekerPhotoPath = `/static/uploads/documents/` + req.files[2].filename
    const seekerExist = await User.findById(req.user._id)
    if (!seekerExist) return res.status(400).json('There is no seeker with this id !');
    try {
        let phUsers = await User.find({ role: userRoles.PHUSER }).select("_id");
        phUsers = phUsers.map(elem => elem._id.toString())
        const allRequests = await Request.find()
            .populate("treatment", "phUser decision reason")
            .select("treatment seeker");
        console.log({ allRequests });
        let allRequestsUntreated = [...allRequests]
            .filter(elem => elem.treatment.decision == "Untreated")
            .map(elem => elem.treatment.phUser.toString());
        var newTreatment;
        if (phUsers.length > 0) {
            var phUsers_with_no_untreated_request = differenceArray(phUsers, allRequestsUntreated);
            var phUsers_with_untreated_request = intersectionArray(phUsers, allRequestsUntreated);
            const selectedPhUser = await getOneElement(phUsers_with_no_untreated_request) || await getOneElement(phUsers_with_untreated_request)
            logger.info(`------TREATMENT.CREATE--------selectedPhUser: ${selectedPhUser}`);
            newTreatment = await new Treatment({ phUser: selectedPhUser });
        } else {
            logger.info(`------TREATMENT.CREATE--------WITHOUT.PHUSER`);
            newTreatment = await new Treatment()
        }
        logger.info(`------TREATMENT.CREATE--------SUCCESSFULLY`);
        await newTreatment.save();
        const newRequest = new Request({
            description: req.body.description || "No description",
            seeker: req.user._id,
            treatment: newTreatment,
            dhHub: req.body.dhHub,
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




/*
Args:
  req: The request object.
  res: the response object
Returns:
  The request object
*/
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
Get all the requests for a phUser.

Args:
  req: The request object.
  res: the response object
Returns:
  The current request and all requests.
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
                .populate("seeker", "firstname lastname ");
            if (treatmentRequest) {
                requestList.push(treatmentRequest)
            }
        }
        const currentRequestUnthread = await requestList.find(elem => elem.treatment.decision == "Untreated")
        logger.info(`------REQUEST.GET.FOR.PHUSER--------SUCCESS`);
        return res.status(200).send({
            currentRequest: currentRequestUnthread || { message: "No current request" },
            allRequests: requestList,
        })
    } catch (error) {
        handleError(error, res);
        return;
    }
}



/*
Get all requests for a seeker.
Args:
  req: The request object.
  res: the response object
Returns:
  The request object with the treatment object embedded in it.
*/
exports.getForSeeker = async(req, res) => {
    logger.info(`------REQUEST.GET.FOR.SEEKER--------BEGIN`);
    const seeker_id = await req.user._id
    try {
        const request = await Request
            .find({ seeker: seeker_id })
            .populate("treatment", "-phUser -__v")
            .populate("dhHub", "location address");
        logger.info(`------REQUEST.GET.FOR.SEEKER--------SUCCESS`);
        return res.status(200).send({ requests: request });
    } catch (error) {
        handleError(error, res);
        return;
    }

}



/*
Get all requests for a specific dhub.

Args:
  req: The request object.
  res: the response object
Returns:
  An array of Request objects.
*/
exports.getForDHub = async(req, res) => {
    logger.info(`------REQUEST.GET.FOR.DHUB --------BEGIN`);
    const dhub_id = req.params.id
    try {
        const dhHubExists = await DhHub.findById(dhub_id)
        if (!dhHubExists) return res.status(400).send({ message: "DhHub not found!" })
        const requestForDhHub = await Request
            .find({ dhHub: dhub_id })
            .populate("seeker", "-__v -tokens -password -hasAccess -isDeleted ")
            .populate("treatment", "-__v");
        logger.info(`------REQUEST.GET.FOR.DHUB --------SUCCESS`);
        return res.status(200).send({
            requests: requestForDhHub
        });

    } catch (error) {
        handleError(error, res);
        return;
    }
}
"use strict";
const multer = require('multer');
const path = require('path');
// const config = require('../../config/environments');
const root = path.normalize(`${__dirname}/../../`);
const pathUpload = 'public/uploads/';



exports.uploadFile = (chemin) => {
    /*
     *Files managment function
     */
    function fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|JPG|JPEG|PNG|PDF)$/)) {
            return cb(new Error('This type of file is not allowed '), false);
        }
        cb(null, true);
    }

    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(root, pathUpload + '' + chemin))
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + 'hackathonstatic' + path.extname(file.originalname));
        }
    })

    return multer({ storage: storage, fileFilter: fileFilter, limits: { fieldSize: 7 * 1024 * 1024 } });
}
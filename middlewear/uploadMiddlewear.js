const multer = require('multer');
const {CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage ({
    cloudinary,
    params:{
        folder:"users",
        allowedFormats:["jpg","png","jpeg"],
        transformation:[
            {
                width:500,
                height:500,
                crop:"limit"
            }
        ]
    }
});


const upload = multer({storage});

module.exports = upload;

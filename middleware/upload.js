const { profile, error } = require('console');
const multer=require('multer')
const path=require('path')



const store=multer.diskStorage({
    destination:(req,file,cb)=>{
              cb(null,"public/images/")
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now() + path.extname(file.originalname));
    }
})


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, JPG, and PNG files are allowed"), false);
    }
};


const uploads = multer({
    storage: store,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

module.exports = uploads;
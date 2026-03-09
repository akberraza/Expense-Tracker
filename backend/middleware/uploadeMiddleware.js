const multer = require("multer");

// Configure Storage
const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, "uploads/");
    },
    filename:(req, file, cd) => {
        cd(null, `${Date.now()}-${file.originalname}`)
    },
})

// File filter
const fileFilter = (req, file, cd) => {
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
    if(allowedTypes.includes(file.mimetype)){
        cd(null, true);
    }else{
        cd(new Error('Only .jepg, .png fromats are allowed'), false);
    }
}

const upload = multer({storage, fileFilter});

module.exports = upload
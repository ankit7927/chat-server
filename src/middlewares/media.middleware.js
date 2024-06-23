const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/profiles")
    },
    filename: (req, file, cb) => {
        const userId = req.user._id;
        const ext = file.originalname.split(".").pop();
        cb(null, `${userId}.${ext}`);
    },
});

module.exports = multer({ storage: storage });

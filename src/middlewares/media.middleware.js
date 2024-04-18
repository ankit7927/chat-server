const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "mediaMax") {
            cb(null, "assets/mediaMax");
        } else if (file.fieldname === "mediaMid") {
            cb(null, "assets/mediaMid");
        } else if (file.fieldname === "mediaLow") {
            cb(null, "assets/mediaMid");
        } else cb(new Error("other fileds is not acceptable."))
    },
    filename: (req, file, cb) => {
        const title = req.body.title.toLowerCase().replaceAll(" ", "").slice(0, 10)
        const ext = file.originalname.split(".").pop()
        cb(null, `${title}.${ext}`)
    }
})

module.exports = multer({ storage: storage })
const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));
router.use("/contact", authMiddleware, require("./contact.route"));


module.exports = router;
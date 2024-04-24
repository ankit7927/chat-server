const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));
router.use("/contact", require("./contact.route"));


module.exports = router;
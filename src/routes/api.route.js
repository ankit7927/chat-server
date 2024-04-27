const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");

router.use("/auth", require("./auth.route"));
router.use("/user", require("./user.route"));


module.exports = router;
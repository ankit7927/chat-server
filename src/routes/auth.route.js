const authController = require("../controllers/auth.controller");

const router = require("express").Router();

router.route("/signin").post(authController.signin);
router.route("/signup").post(authController.signup);

module.exports = router;
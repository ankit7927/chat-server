const authService = require("../services/auth.service");

const authController = {};

/**
 * this is a temp auth implimentations.
 */
authController.signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) 
        return res.status(404).json({ message: "all fileds are required" });

    try {
        res.json(await authService.signin(email, password))
    } catch (error) {
        next(error)
    }
}

module.exports = authController;
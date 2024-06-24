const jwt = require("jsonwebtoken");

const secrate = process.env.JWT_SECRATE;

const genrateToken = (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRATE, {
        expiresIn: "18h",
        algorithm: "RS512",
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRATE);
};

module.exports = { genrateToken, verifyToken };

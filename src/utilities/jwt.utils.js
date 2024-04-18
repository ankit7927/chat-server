const jwt = require("jsonwebtoken");

const secrate = process.env.JWT_SECRATE || "Secrate";

const genrateToken = (id) => {
    return jwt.sign({ _id: id }, secrate)
}

const verifyToken = (token) => {
    return jwt.verify(token, secrate)
}

module.exports = { genrateToken, verifyToken };
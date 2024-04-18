const { verifyToken } = require("../utilities/jwt.utils");


module.exports = authMiddlewere = (req, res, next) => {
    const token = req.headers.token || req.headers.Authorization || req.headers.authorization || "";
    if (!token) return res.status(409).json({ message: "no token provided" });

    try {
        const decode = verifyToken(token);
        req.user = decode;
        next();
        
    } catch (error) {
        res.status(500).json({ message: "failed to decode token" });
    }
}

const roleAuthMiddlewere = (roles) => {
    return (req, res, next) => {
        const token = req.headers.token || req.headers.Authorization || req.headers.authorization || "";
        if (!token) return res.status(409).json({ message: "no token provided" });

        try {
            const decode = verifyToken(token);
            req.user = decode;
            next();

            if (roles.includes(decode.role)) {
                req.user = decode;
                next();
            } else res.status(407).json({ message: "route not permitted" })
        } catch (error) {
            res.status(500).json({ message: "failed to decode token" });
        }
    }
}


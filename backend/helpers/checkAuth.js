const jwt = require("jsonwebtoken");
const UserAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.userData = {
            phone: decodedToken.phone,
            id: decodedToken.id,
            name: decodedToken.name
        };
        console.log(req.userData)
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};

module.exports = UserAuth
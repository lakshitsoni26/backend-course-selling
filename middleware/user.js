const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const user = require("../routes/user");

function userMiddleware(req, res, next){
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_USER_PASSWORD);

    if (decoded) {
        req.userId = decoded.indexOf;
        next()
    } else {
        res.status(403).json({
            message: "You are not sign in"
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}
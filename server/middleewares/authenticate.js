const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(404).json({
                error: 'Please log in.'
            });
            return;
        }
        req.user = decoded;
        next();
    });
}
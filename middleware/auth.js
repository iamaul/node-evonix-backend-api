const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // GET token from Headers
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ status: false, msg: 'Token not found, authorization denied.' });
    }

    // Verify token
    try {
        jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
            if (error) {
                return res.status(401).json({ status: false, msg: 'Invalid token.' });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: false, msg: 'An unexpected error has occurred.' });
    }
}
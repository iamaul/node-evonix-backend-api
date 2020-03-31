const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // GET token from Headers
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ status: false, message: 'Token not found, authorization denied.' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error.message);
        return res.status(401).json({ status: false, message: 'Invalid token.' });
    }
}
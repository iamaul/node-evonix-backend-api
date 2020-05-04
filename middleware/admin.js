module.exports = function(req, res, next) {
    if (req.user.admin >= 1) {
        next();
    } else {
        return res.status(401).json({ status: false, msg: '401 Not Authorized.' });
    }    
}
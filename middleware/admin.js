module.exports = function(req, res, next) {
    if (req.user.admin >= 1) {
        return res.status(401).json({ status: false, msg: 'You\'re not authorized to access this page.' });
    } else {
        next();
    }    
}
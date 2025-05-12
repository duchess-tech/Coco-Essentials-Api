
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: 'Access denied: No user information available' });
        }

        if (req.user.isAdmin==true && roles.includes('admin')) {
            return next();
        } else if (req.user.isAdmin ==false && roles.includes('user')) {
            return next();
        } else {
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }
    };
};

module.exports = authorizeRoles;




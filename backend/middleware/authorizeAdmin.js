// Authorize Admin Middleware
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    next();
};

module.exports = {
    authorizeAdmin,
};
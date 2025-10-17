// middleware/authorizeRole.js
module.exports = function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // If allowedRoles is empty, allow all authenticated users
    if (allowedRoles.length === 0 || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      message: 'Forbidden: You do not have permission to perform this action.'
    });
  };
};

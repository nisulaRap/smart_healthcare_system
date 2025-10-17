// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

class AuthMiddleware {
  authenticate(req, res, next) {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;
      
      // Demo token for development
      const DEMO_TOKEN = 'demo-token-123';
      
      if (authHeader && authHeader === `Bearer ${DEMO_TOKEN}`) {
        // Demo user for development
        req.user = {
          id: 'PAT001', // Use one of our mock patient IDs
          email: 'john.smith@email.com'
        };
        return next();
      }

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // For real JWT tokens
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user info to request
      req.user = {
        id: decoded.id,
        email: decoded.email
      };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  }
}

module.exports = new AuthMiddleware();
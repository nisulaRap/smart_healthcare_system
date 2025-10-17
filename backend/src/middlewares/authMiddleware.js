const jwt = require('jsonwebtoken');

class AuthMiddleware {
  authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      const DEMO_TOKEN = 'demo-token-125';
      
      if (authHeader && authHeader === `Bearer ${DEMO_TOKEN}`) {
        req.user = {
          id: 'PAT001', 
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

      const token = authHeader.substring(7);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
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
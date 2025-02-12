const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Extract token (remove 'Bearer ' prefix)
        const tokenValue = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access Forbidden: Insufficient permissions' });
      }
      next();
    };
  };

module.exports = { authenticate, authorizeRole };

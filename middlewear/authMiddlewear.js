const jwt = require('jsonwebtoken');
const {User} = require('../models')

//checking whether token exits and if exists then remove 
const authenticate = async(req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided",status:false,status_code:401 });
        }

        // Extract token (remove 'Bearer ' prefix)
        const tokenValue = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        console.log("byeeeeee",decoded)

        // Fetch the user from the database
        const user = await User.findOne({ where: { id: decoded.id } });

        // Check if the user exists and compare roles
        if (!user) {
            return res.status(404).json({ message: "User not found",
              status:false,
              status_code:404,
             });
        }

        //this checks whether the users role has been changed from user to admin or admin to user and if yes then 
        //logs them out
        if (user.role !== decoded.role) {
            return res.status(403).json({ message: "Invalid token: Role mismatch",
              status:false,
              status_code:403,
             });
        }

        // Attach user info to request object
        req.user = user; // Store full user object instead of just decoded token

        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token",status:false,
          status_code:403
         });
    }
};

//This checks that the user should be of a specific role either admin or user
const authorizeRole = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Access Forbidden: Insufficient permissions',
          status:false,
          status_code:403
        });
      }
      next();
    };
  };

module.exports = { authenticate, authorizeRole };

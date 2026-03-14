import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ 
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ 
      message: "Invalid or expired token" 
    });
  }
};

// Middleware to verify super admin role
export const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      message: "Access denied. Super admin privileges required." 
    });
  }
  next();
};

// Middleware to verify admin role (for admin panel)
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
  next();
};

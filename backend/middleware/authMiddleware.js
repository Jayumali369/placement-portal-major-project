import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

/**
 * Middleware to protect routes by verifying JWT token
 * It extracts the token from the Authorization header (Bearer token)
 * and verifies its validity. If valid, it attaches the decoded user data
 * to the request object.
 */
export const protect = (req, res, next) => {
  let token;
  // Check if Authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token part
      token = req.headers.authorization.split(' ')[1];
      
      // Verify the token using the secret key
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Attach decoded payload (like user ID and role) to req.user
      req.user = decoded;
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token is provided at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Middleware to restrict access to admin users only.
 * This must be used AFTER the `protect` middleware, so that `req.user` is available.
 */
export const adminOnly = (req, res, next) => {
  // Ensure user is populated and role is admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

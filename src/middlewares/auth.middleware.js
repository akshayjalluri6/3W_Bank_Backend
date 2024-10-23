import jwt from 'jsonwebtoken';

// Middleware to authenticate token and set req.user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // Expecting "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });
    
    req.user = user;  // Store decoded JWT (user information) in req.user
    next();
  });
};

export default authenticateToken;

const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'your-very-secure-secret-key';

exports.authenticateJWT = (req, res, next) => {
  // JWT authentication logic
   const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
};
const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) req.user = user; // attach user info if valid
      next();
    });
  } else {
    next();
  }
};

module.exports = optionalAuth;

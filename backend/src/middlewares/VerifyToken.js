const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "Access Denied: No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyToken;

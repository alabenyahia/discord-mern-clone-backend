const jwt = require("jsonwebtoken");

const authMidleware = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Your should login first" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(400).json({ error: "Invalid auth token" });
  }
};

module.exports = authMidleware;

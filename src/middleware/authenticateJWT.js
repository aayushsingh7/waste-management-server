import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.trial;

  if (!token) {
    return res.status(403).send("Access denied.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user_id = decoded;
    next();
  } catch (err) {
    res.status(401).send("Invalid or expired token.");
  }
};

export default authenticateJWT;

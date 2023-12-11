import jwt from "jsonwebtoken";
const config = process.env;

const verifyToken = (req, res, next) => {
  // retrieve token from user
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .json({ error: "A token is required for authentication" });
  }

  try {
    // decode jwt token
    const decoded = jwt.verify(token, config.TOKEN_KEY);

    // assign decoded payload to req.user for future reference
    req.user = decoded;
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }

  return next();
};

export default verifyToken;

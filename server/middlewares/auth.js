import jwt from "jsonwebtoken";
const config = process.env;

const verifyToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshtoken;
  const accessToken = req.headers["x-auth-token"];

  if (!refreshToken && !accessToken) {
    return res.status(400).json({ error: "No Token provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, config.TOKEN_KEY);
    req.user = decoded.user_id;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh Token provided" });
    }

    try {
      const decoded = jwt.verify(refreshToken, config.TOKEN_KEY);
      const accessToken = jwt.sign(
        { encodedUser: decoded.encodedUser },
        config.TOKEN_KEY,
        { expiresIn: "2h" }
      );
      req.user = decoded.user_id;
      res.header("x-auth-token", accessToken);
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Invalid token" });
    }
  }
};

export default verifyToken;

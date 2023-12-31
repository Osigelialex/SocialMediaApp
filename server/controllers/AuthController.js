import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const config = process.env;

const AuthController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // confirm that all fields were entered
      if (!(username && email && password)) {
        return res.status(400).json({ error: "all fields required" });
      }

      // check if a user exists with the entered email
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return res
          .status(409)
          .json({ error: "user with email already exists" });
      }

      // check if a user exists with the entered username
      const existingUserWithUsername = await User.findOne({ username });
      if (existingUserWithUsername) {
        return res
          .status(409)
          .json({ error: "user with username already exists" });
      }

      // encrypt password before storing in database
      const encryptedPassword = await bcrypt.hash(password, 10);

      // create new user
      const user = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      res.status(201).json({
        status: "success",
        message: "registration successful",
        user: {
          id: user._id,
          username,
          email,
        },
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "internal server error" });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // verify that email and password were entered correctly
      if (!(email && password)) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // check for an existing user with the provided email and password
      const user = await User.findOne({ email });

      // check if user entered the right password
      if (!(user && (await bcrypt.compare(password, user.password)))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const encodedUser = {
        user_id: user._id,
        email,
      };

      // generate tokens for user
      const accessToken = jwt.sign(encodedUser, config.TOKEN_KEY, {
        expiresIn: 120,
      });
      const refreshToken = jwt.sign(encodedUser, config.TOKEN_KEY, {
        expiresIn: "5d",
      });

      // store accesstoken in authorization header and refreshtoken in cookies
      res
        .cookie("refreshtoken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("x-auth-token", accessToken)
        .status(200)
        .json({
          status: "success",
          message: "login successful. Welcome back",
          user: {
            id: user._id,
            username: user.username,
            displayname: user.displayname,
            email,
            bio: user.bio,
            location: user.location
          },
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },

  refresh: (req, res) => {
    // check for refresh token in cookies
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "Access denied. No refresh tokens found" });
    }

    // verify if refresh token is valid
    try {
      const decoded = jwt.verify(refreshToken, config.TOKEN_KEY);
      const accessToken = jwt.sign(
        { encodedUser: decoded.encodedUser },
        config.TOKEN_KEY,
        { expiresIn: 120 }
      );

      const user = decoded.encodedUser;

      // store new access token is user auth header
      res.header("x-auth-token", accessToken).status(200).json({
        status: "success",
        message: "access token generated successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid refresh Token" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("refreshtoken");
    res.removeHeader("x-auth-token");
    res.status(200).json({ message: "logged out successfully " });
  }
};

export default AuthController;

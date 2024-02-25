// external imports
import dotenv from "dotenv";

// internal imports
import User from "../models/user.model.js";
import { ErrorResponse } from "../utils/error.utils.js";
import { Blacklist } from "../models/token.model.js";
import {
  asyncHandler,
  checkPassword,
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../utils/util.utils.js";

dotenv.config();

/**
 * Registers new users
 * @param {Object} req - the request body requirs a username, email, and password
 * @return - a response entity with containing the user object
 */
export const signup = asyncHandler(async (req, res) => {
  const { email, username, ...rest } = req.body;
  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new ErrorResponse("Email already exists", 409);
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ErrorResponse("Username already exists", 409);
  }

  const user = await User.create({ email, username, ...rest });
  user.password = undefined;
  res.status(200).json({ status: "success", user });
});

/**
 * Logs in users
 * @param {Object} req - the request body requires an email and password
 * @return - a response entity with the user object, access token and refresh token
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  const isValid = await checkPassword.call(user, password);
  if (!isValid) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  user.password = undefined;
  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    SameSite: "none",
  });

  res.status(200).json({ status: "success", user, accessToken, refreshToken });
});

/**
 * Refreshes access token
 * @param {Object} req - the request body requires a refresh token
 * @return - a response entity with the new access token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ErrorResponse("Token not found", 404);
  }

  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    throw new ErrorResponse("Invalid token", 401);
  }

  const tokenBlacklisted = await Blacklist.findOne({ token: refreshToken });
  if (tokenBlacklisted) {
    throw new ErrorResponse("Invalid token", 401);
  }

  const accessToken = createAccessToken(decoded.id);
  res.status(200).json({ status: "success", accessToken });
});

/**
 * Logs out users
 * The cookie is cleared and the refresh token is blacklisted
 * @return - a response entity with a success message
 */
export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  await Blacklist.create({ token: refreshToken });
  res.clearCookie("refreshToken");
  res
    .status(200)
    .json({ status: "success", message: "logged out successfully" });
});

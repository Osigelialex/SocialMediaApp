// external imports
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// internal imports
import User from "../models/user.model.js";
import { ErrorResponse } from "../utils/error.utils.js";
import {
  Blacklist,
  ResetToken,
  EmailVerificationToken,
} from "../models/token.model.js";
import { sendMail } from "../utils/mail.utils.js";
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
 * Verifies user's email
 * @param {Object} req - the request body requires an email
 * @return - a response entity with a message and link to verify email
 */
export const requestEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ErrorResponse("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ErrorResponse(`No account associated with ${email}`, 404);
  }

  const token = await EmailVerificationToken.findOne({ userId: user._id });
  if (token) await EmailVerificationToken.deleteOne({ userId: user._id });

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(
    emailVerificationToken,
    Number(process.env.SALT_ROUNDS)
  );

  await EmailVerificationToken.create({
    userId: user._id,
    token: hashedToken,
  });

  const link = `https://localhost:5000/verify-email?token=${emailVerificationToken}&id=${user._id}`;
  await sendMail(
    email,
    "Account Verification",
    `Hello, ${user.username} \n\n Please click on the link below to verify your account \n\n ${link} \n\n Thanks, \n\n Z.com`
  );

  return res.status(200).json({
    status: "success",
    message: "Email verification link sent successfully",
    link,
  });
});

/**
 * Verifies user's email
 * @param {Object} req - the request body requires a userId and token
 * @return - a response entity with a success message
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) {
    throw new ErrorResponse("Invalid verification link", 401);
  }

  const emailVerificationToken = await EmailVerificationToken.findOne({
    userId,
  });

  if (!emailVerificationToken) {
    throw new ErrorResponse("Invalid verification link", 401);
  }

  const isValid = await bcrypt.compare(token, emailVerificationToken.token);
  if (!isValid) {
    throw new ErrorResponse("Invalid verification link", 401);
  }

  const user = await User.findById(userId);
  user.isActive = true;
  await Promise.all([user.save(), emailVerificationToken.deleteOne()]);

  await sendMail(
    user.email,
    "Account Verification",
    `Hello, ${user.username} \n\n Your account has been verified successfully \n\n Thanks, \n\n Z.com`
  );

  res
    .status(200)
    .json({ status: "success", message: "Account verified successfully" });
});

/**
 * Requests password reset
 * @param {Object} req - the request body requires an email
 * @return - a response entity with a message and link to reset password
 */
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ErrorResponse(`No account associated with ${email}`, 404);
  }

  const token = await ResetToken.find({ userId: user._id });
  if (token) await ResetToken.deleteOne({ userId: user._id });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = await bcrypt.hash(
    resetToken,
    Number(process.env.SALT_ROUNDS)
  );

  await new ResetToken({ userId: user._id, token: hashedResetToken }).save();
  const link = `localhost:5000/password-reset?token=${resetToken}&id=${user._id}`;
  await sendMail(
    email,
    "Password Reset",
    `Hello, ${user.username} \n\n Please click on the link below to reset your password \n\n ${link} \n\n Thanks, \n\n Z.com`
  );
  res
    .status(200)
    .json({ status: "success", message: "Password reset link sent", link });
});

/**
 * Resets user's password
 * @param {Object} req - the request body requires a userId, token and password
 * @return - a response entity with a success message
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, token, password } = req.body;
  const passwordResetToken = await ResetToken.findOne({ userId });

  if (!passwordResetToken) {
    throw new ErrorResponse("Invalid or expired reset token", 401);
  }

  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new ErrorResponse("Invalid or expired reset token", 401);
  }

  const user = await User.findOne({ _id: userId });
  user.password = password;

  await Promise.all([user.save(), passwordResetToken.deleteOne()]);
  await sendMail(
    user.email,
    "Password Reset",
    `Hello, ${user.username} \n\n Your password has been reset successfully \n\n Thanks, \n\n Z.com`
  );

  res
    .status(200)
    .json({ status: "success", message: "Password reset successful" });
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

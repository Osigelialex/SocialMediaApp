import User from "../models/user.model.js";
import { ErrorResponse } from '../utils/error.utils.js';
import { asyncHandler } from "../utils/util.utils.js";

/**
 * Get all users
 * @return - a response entity with all users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -__v");
  if (!users) {
    throw new ErrorResponse("no users found", 404);
  }
  res.status(200).json({ message: "no users found" });
});

/**
 * Get a user
 * @param {Object} req - The request body requires a user id
 * @return - a response entity with the user object
 */
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -__v");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json({ status: "success", user });
});

/**
 * Update a user
 * @param {Object} req - The request body requires a user id
 * @return - a response entity with the updated user object
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // ensure updates are only profilePicture, displayname, location, bio
  const validUpdates = ["profilePicture", "displayname", "location", "bio"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) => validUpdates.includes(update));
  if (!isValidUpdate) {
    throw new ErrorResponse("invalid updates", 400);
  }

  // add profilePicture to req.body if it exists
  const profilePicture = req.file.path;
  if (profilePicture) req.body.profilePicture = profilePicture;

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) {
    res.status(404).json({ error: "user not found" });
  }

  res.status(200).json({
    status: "success",
    message: "user updated successfully",
    user: {
      id: user._id,
      username: user.username,
      displayname: user.displayname,
      email: user.email,
      bio: user.bio,
      location: user.location,
      profilePicture: user.profilePicture
    },
  });
})

/**
 * Create a user
 * @param {Object} req - The request body requires a user email and password
 * @return - a response entity with the user object
 */
export const createUser = asyncHandler(async (req, res) => {
  const { email, ...rest } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ErrorResponse("User already exists", 409);
  }
  const user = await User.create({ email, ...rest });
  user.password = undefined;
  res.status(200).json({ status: "success", user });
});

/**
 * Delete a user
 * @param {Object} req - The request body requires a user id
 * @return - a response entity with a success message
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json({
    status: "success",
    message: "user deleted successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
})

/**
 * Search for a user
 * @param {String} query - The query string containing the user's displayname or username
 * @return - a response entity with the user object
 */
export const searchUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const [userFromDisplayname, userFromUsername] = await Promise.all([
    User.findOne({ displayname: query }).select("-password -__v"),
    User.findOne({ username: query }).select("-password -__v"),
  ]);

  if (!(userFromDisplayname || userFromUsername)) {
    return res.status(404).json({ message: "user not found" });
  }

  if (userFromDisplayname) {
    return res
      .status(200)
      .json({ status: "success", user: userFromDisplayname });
  }

  if (userFromUsername) {
    return res
      .status(200)
      .json({ status: "success", user: userFromUsername });
  }
})

/**
 * Get the current authenicatd user
 * @param {Object} req - the request body requires a user id
 * @return - a response entity with the user and followers
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password -__v");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json({ status: "success", user });
});

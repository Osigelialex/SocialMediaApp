import User from "../models/user.model.js";
import { ErrorResponse } from "../utils/error.utils.js";
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

  res.status(200).json({ users });
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

  // Ensure updates are only valid fields
  const validUpdates = ["file", "displayname", "location", "bio"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isValidUpdate) {
    throw new ErrorResponse("Invalid updates", 400);
  }

  // Add profilePicture to req.body if a file is present
  const profilePicture = req.file ? req.file.filename : null;
  if (profilePicture) {
    req.body.profilePicture = profilePicture;
  }

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    user: {
      id: user._id,
      username: user.username,
      displayname: user.displayname,
      email: user.email, // Assuming you want to include email in the response
      bio: user.bio,
      location: user.location,
      profilePicture: user.profilePicture,
    },
  });
});

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
});

/**
 * Search for a user
 * @param {String} query - The query string containing the user's displayname or username
 * @return - a response entity with the user object
 */
export const searchUser = asyncHandler(async (req, res) => {
  const query = req.query.query;

  const [userFromDisplayname, userFromUsername] = await Promise.all([
    User.findOne({ displayname: query }).select("-password -__v"),
    User.findOne({ username: query }).select("-password -__v"),
  ]);

  if (userFromDisplayname || userFromUsername) {
    return res
      .status(200)
      .json({
        status: "success",
        user: userFromDisplayname || userFromUsername,
      });
  } else {
    throw new ErrorResponse("User not found", 404);
  }
});

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

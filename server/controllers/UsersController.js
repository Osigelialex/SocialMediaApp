import User from "../models/user.js";
import { ErrorResponse } from '../utils/error.js';
import { asyncHandler } from "../utils/utils.js";

// get a list of users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -__v");
  if (!users) {
    throw new ErrorResponse("no users found", 404);
  }
  res.status(200).json({ message: "no users found" });
});

// get a user
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -__v");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json({ status: "success", user });
});

// update a user
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const avatar = req.file.filename;

  // prevent user from updating username
  if (req.body.username) {
    return res.status(400).json({ error: "username cannot be updated" });
  }

  // prevent user from updating password
  if (req.body.password) {
    return res.status(400).json({ error: "password cannot be updated" });
  }

  req.body.avatar = avatar;
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
      avatar: `http://localhost:5000/uploads/${user.avatar}`
    },
  });
})

// create a user
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

// delete a user
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

// search for a user by username or displayname
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

// get the current authenticated user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user).select("-password -__v");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }
  res.status(200).json({ status: "success", user });
});

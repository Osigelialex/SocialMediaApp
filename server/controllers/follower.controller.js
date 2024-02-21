import User from "../models/user.model.js";
import { asyncHandler } from "../utils/util.utils.js";
import { ErrorResponse } from "../utils/error.utils.js";

/**
 * Get followers of a user
 * @param {Object} req - the request body requires a user id
 * @return - a response entity with the user and followers
 */
export const getFriends = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ErrorResponse("user not found", 404);
  }

  res.status(200).json({ user, friends: user.friends });
});

/**
 * Get follow suggestions
 * @param {Object} req - the request body requires a user id
 */
export const getFollowSuggestions = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return new ErrorResponse("user not found", 404);
  }

  const suggestions = await User.find({
    _id: { $ne: userId },
    friends: { $ne: userId },
  }).limit(5);

  res.status(200).json({ status: "success", suggestions });
});

/**
 * Follow a user
 * @param {Object} req - the request body requires a user id
 * @return - a response entity with a success message
 */
export const followUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const [user, currentUser] = await Promise.all([
    User.findById(userId),
    User.findById(req.user),
  ]);

  if (!user) {
    throw new ErrorResponse("user not found", 404);
  }

  if (currentUser.friends.includes(userId)) {
    throw new ErrorResponse("user already followed", 403);
  }

  currentUser.friends.push(userId);
  await currentUser.save();

  res
    .status(200)
    .json({ status: "success", message: "User has been followed" });
});

/**
 * Unfollow a user
 * @param {Object} req - the request body requires a user id
 * @return - a response entity with a success message
 */
export const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const [user, currentUser] = await Promise.all([
    User.findById(userId),
    User.findById(req.user),
  ]);

  if (!user) {
    throw new ErrorResponse("user not found", 404);
  }

  if (!currentUser.friends.includes(userId)) {
    throw new ErrorResponse("user not followed", 403);
  }

  currentUser.friends.push(userId);
  await currentUser.save();

  res
    .status(200)
    .json({ status: "success", message: "user has been unfollowed" });
});

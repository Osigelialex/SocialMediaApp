import Follower from "../models/followers.js";
import User from "../models/user.js";
import { asyncHandler } from "../utils/utils.js";

// get followers for a user
export const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const followers = await Follower.find({ to: userId })
    .populate("from to")
    .select("from");

  if (followrs.length === 0) {
    return res.status(404).json({ message: "no followers found" });
  }
  res.status(200).json({ user, followers });
})

// get following of a user
export const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ messag: "user not found" });
  }
  const following = await Follower.find({ from: userId })
    .populate("to")
    .select("to")

  if (following.length === 0) {
    return res.status(400).json({ message: "no following found" });
  }
  res.status(200).json({ user, following });
})

// follow a user
export const followUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const [user, currentUser] = await Promise.all([
    User.findById(userId),
    User.findById(req.user),
  ]);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const follow = await Follower.findOne({ from: req.user._id, to: userId });
  if (follow) {
    return res.status(403).json({ error: "User already following provided user" });
  }
  await Follower.create({
    from: req.user._id,
    to: userId
  });

  currentUser.following += 1;
  user.followers += 1;
  await Promise.all([currentUser.save(), user.save()]);
  res.status(200).json({ status: "success", message: "User has been followed" });
})

// unfollow a user
export const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const [user, currentUser] = await Promise.all([
    User.findById(userId),
    User.findById(req.user),
  ]);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  const follow = await Follower.findOneAndDelete({
    from: req.user._id,
    to: userId
  });
  if (!follow) {
    return res.status(403).json({ message: "user does not follow provided user" });
  }
  currentUser.following -= 1;
  user.followers -= 1;
  await Promise.all([user.save(), currentUser.save()]);
  res.status(200).json({ status: "success", message: "user has been unfollowed" });
})

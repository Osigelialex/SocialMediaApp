import Follower from "../models/followers.js";
import User from "../models/user.js";

const FollowerController = {
  getFollowers: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      const followers = await Follower.find({ to: userId })
        .populate("from to")
        .select("from");

      if (followers.length === 0) {
        return res.status(404).json({ message: "no followers found" });
      }

      res.status(200).json({ user, followers });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "failed to fetch followers" });
    }
  },

  getFollowing: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      const following = await Follower.find({ from: userId })
        .populate("to")
        .select("to");

      if (following.length === 0) {
        return res.status(404).json({ message: "no following found" });
      }

      res.status(200).json({ user, following });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "failed to fetch user following" });
    }
  },

  followUser: async (req, res) => {
    try {
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
        return res
          .status(403)
          .json({ error: "user already following provided user" });
      }
      await Follower.create({
        from: req.user._id,
        to: userId,
      });

      currentUser.following += 1;
      user.followers += 1;

      await Promise.all([currentUser.save(), user.save()]);

      res
        .status(200)
        .json({ status: "success", message: "user has been followed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "error following user" });
    }
  },

  unfollowUser: async (req, res) => {
    try {
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
        to: userId,
      });
      if (!follow) {
        return res.status(403).json({ message: "user does not follow provided user" });
      }

      currentUser.following -= 1;
      user.followers -= 1;
      await Promise.all([user.save(), currentUser.save()]);

      res
        .status(200)
        .json({ status: "success", message: "user has been unfollowed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "error unfollowing user" });
    }
  },
};

export default FollowerController;

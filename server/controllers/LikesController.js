import { Post, Like } from "../models/posts.js";

const LikeController = {
  likePost: async (req, res) => {
    const postId = req.params.id;
    const userId = req.user;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }

      // check if user already liked the post
      const userLike = await Like.find({ post: post._id, user: userId });
      if (userLike.length > 0) {
        return res.status(403).json({ error: "user already liked post" });
      }

      post.likes += 1;
      await post.save();

      await Like.create({
        post: postId,
        user: userId,
      });

      res.status(200).json({ status: "success", message: "post liked", post });
    } catch (error) {
      return res.status(500).json({ error: "could not like post" });
    }
  },

  getPostLikes: async (req, res) => {
    const postId = req.params.id;

    try {
      const likes = await Like.find({ post: postId }).populate({
        path: "user",
        select: "-password -__v",
      });
      if (likes.length === 0) {
        return res.status(404).json({ message: "post has no likes" });
      }
      res.status(200).json({ status: "success", likes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "could not fetch likes for post" });
    }
  },

  unlikePost: async (req, res) => {
    const postId = req.params.id;
    const userId = req.user;

    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }

      // check if user does not like post
      const userLike = await Like.findOneAndDelete({
        post: post._id,
        user: userId,
      });

      if (!userLike) {
        return res.status(403).json({ error: "user does not like post" });
      }

      post.likes -= 1;
      await post.save();

      res.status(200).json({ status: "success", message: "post unliked" });
    } catch (error) {
      return res.status(500).json({ error: "could not unlike post" });
    }
  },
};

export default LikeController;

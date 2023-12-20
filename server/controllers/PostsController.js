import { Post, Like, Comment } from "../models/posts.js";
import User from "../models/user.js";

const PostController = {
  createPost: async (req, res) => {
    try {
      const { content } = req.body;
      const post = await Post.create({
        userId: req.user,
        content,
      });
      res.status(201).json({
        status: "success",
        message: "post created successfully",
        post,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "could not create post" });
    }
  },
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate("user", "-password -__v");
      res.status(200).json({ status: "success", posts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "could not retrieve all posts" });
    }
  },
  getPost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id).populate("user", "-password -__v");
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      res.status(200).json({ status: "success", post });
    } catch (error) {
      res.status(500).json({ error: "could not get post" });
    }
  },
  updatePosts: async (req, res) => {
    try {
      const { id } = req.params;

      // check if post exists then update
      const post = await Post.findById(id).where("user").equals(req.user);

      if (!post) {
        return res.status(403).json({ error: "could not update post" });
      }

      await Post.findByIdAndUpdate(post._id, req.body, { new: true }).populate(
        "user",
        "-password, -__v"
      );

      res
        .status(200)
        .json({ status: "success", message: "post updated", post });
    } catch (error) {
      res.status(500).json({ error: "could not update post" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id).where("user").equals(req.user);

      if (!post) {
        return res.status(403).json({ error: "could not delete post" });
      }

      // check if post exists then delete
      await Post.findByIdAndDelete(id).populate("user", "-password -__v");
      res
        .status(200)
        .json({ status: "success", message: "post deleted", post });
    } catch (error) {
      res.status(500).json({ error: "could not delete post" });
    }
  },
  likePost: async (req, res) => {
    const { userId, postId } = req.params;

    try {
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }

      // check if user already liked the post
      const userLike = await Like.find({ post: post._id, user: user._id });
      if (userLike.length > 0) {
        return res.status(403).json({ error: "user already liked post" });
      }

      await Like.create({
        post: postId,
        user: userId,
      });
    } catch (error) {
      return res.status(500).json({ error: "could not like post" });
    }

    res.status(200).json({ status: "success", message: "post liked" });
  },
  getPostLikes: async (req, res) => {
    const { postId } = req.params;

    try {
      const likes = await Like.find({ post: postId }).populate({
        path: "post user",
        select: "-password -__v",
      });
      if (!likes) {
        return res.status(404).json({ message: "post has not likes" });
      }
      res.status(200).json({ status: "success", likes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "could not fetch likes for post" });
    }
  },
  unlikePost: async (req, res) => {
    const { postId, userId } = req.params;

    try {
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      // check if user does not like post already
      const userLike = await Like.findOne({ post: post._id, user: user._id });
      if (!userLike) {
        return res.status(403).json({ error: "user does not like post" });
      }

      // delete users like
      await Like.findOneAndDelete({ post: post._id, user: user._id });
      res.status(200).json({ status: "success", message: "post unliked" });
    } catch (error) {
      return res.status(500).json({ error: "could not unlike post" });
    }
  },
};

export default PostController;

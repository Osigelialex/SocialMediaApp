import { Post } from "../models/posts.js";

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
};

export default PostController;

import { Comment, Post } from "../models/posts.js";

const commentController = {
  createComment: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "could not find post" });
      }

      const { content } = req.body;
      if (!content) {
        return res.status(409).json({ error: "comment content is required" });
      }

      const comment = await Comment.create({
        post: postId,
        user: req.user,
        content,
      });

      post.comments += 1;
      await post.save();

      res
        .status(200)
        .json({ status: "success", message: "comment created", comment });
    } catch (error) {
      return res.status(500).json({ error: "could not create comment" });
    }
  },

  getComments: async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "could not find post" });
      }

      const comments = await Comment.find({ post: postId }).populate(
        "user",
        "-password -__v"
      );
      if (comments.length === 0) {
        return res.status(404).json({ error: "no comments found" });
      }

      res.status(200).json({ status: "success", comments });
    } catch (error) {
      return res.status(500).json({ error: "could not fetch comments" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const { commentId, id } = req.params;

      const [post, comment] = await Promise.all([
        Post.findById(id),
        Comment.findOne({ _id: commentId, user: req.user })
      ]);

      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }

      if (!comment) {
        return res.status(403).json({ error: "user cannot delete comment" });
      }

      post.comments -= 1;
      await comment.save();

      // check if post exists then delete
      await Comment.findByIdAndDelete(commentId);
      res
        .status(200)
        .json({ status: "success", message: "comment deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "could not delete comment" });
    }
  },
};

export default commentController;

import { Comment, Post, Reply } from "../models/posts.js";
import { asyncHandler } from "../utils/utils.js";
import { ErrorResponse } from "../utils/error.js";

// create a new comment for a post
export const createComment = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("could not find post", 404);
  }
  const { content } = req.body;
  if (!content) {
    throw new ErrorResponse("comment content is required", 409);
  }
  post.comments += 1;
  const [newPost, comment] = await Promise.all([
    post.save(),
    Comment.create({
      post: postId,
      user: req.user,
      content,
    }),
  ]);
  res.status(200).json({ status: "success", message: "comment created", comment });
});

// get all comments for a post
export const getComments = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("could not find post", 404);
  }
  const comments = await Comment.find({ post: postId }).populate(
    "user",
    "-password -__v"
  );
  if (comments.length === 0) {
    throw new ErrorResponse("no comments found", 404);
  }
  res.status(200).json({ status: "success", comments });
})

// delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId, id } = req.params;
  const [post, comment] = await Promise.all([
    Post.findById(id),
    Comment.findOne({ _id: commentId, user: req.user }),
  ]);
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }
  if (!comment) {
    throw new ErrorResponse("user cannot delete comment", 403);
  }
  post.comments -= 1;
  await Promise.all([post.save(), Comment.findByIdAndDelete(commentId)]);
  res.status(200).json({ status: "success", message: "comment deleted" });
})

// create a reply to a comment
export const createReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ErrorResponse("Could not find comment", 404);
  }
  const { content } = req.body;
  if (!content) {
    throw new ErrorResponse("Reply content is required", 409);
  }
  const reply = await Reply.create({
    comment: id,
    user: req.user,
    content,
  });
  comment.replies += 1;
  return res.status(200).json({ status: "success", message: "reply created", reply });
})

// get all replies for a comment
export const getReplies = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ErrorResponse("could not find comment", 404);
  }
  const replies = await Reply.find({ comment: id }).populate(
    "user",
    "-password -__v"
  );
  if (replies.length === 0) {
    throw new ErrorResponse("no replies found", 404);
  }
  return res.status(200).json({ status: "success", replies });
})

// delete a reply
export const deleteReply = asyncHandler(async (req, res) => {
  const { id, replyId } = req.params;
  const [comment, reply] = await Promise.all([
    Comment.findById(id),
    Reply.findOne({ _id: replyId, user: req.user })
  ]);
  if (!comment) {
    throw new ErrorResponse("could not find comment", 404);
  }
  if (!reply) {
    throw new ErrorResponse("could not find reply", 404);
  }
  comment.replies -= 1;
  await Promise.all([comment.save(), Reply.findByIdAndDelete(replyId)]);
  return res.status(200).json({ status: "success", message: "reply deleted" });
})

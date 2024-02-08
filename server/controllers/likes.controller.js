import { Post, Like } from "../models/post.model.js";
import { asyncHandler } from "../utils/util.utils.js";
import { ErrorResponse } from "../utils/error.utils.js";

/**
 * Like a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with the post object
 */
export const LikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }
  const userLike = await Like.find({ post: post._id, user: userId });
  if (userLike.length > 0) {
    throw new ErrorResponse("user already liked post", 403);
  }
  post.likes += 1;
  await Promise.all([
    post.save(),
    Like.create({
      post: postId,
      user: userId
    })
  ]);
  res.status(200).json({ status: "success", message: "post liked", post });
});

/**
 * Get all likes for a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with the likes for a post
 */
export const getPostLikes = asyncHandler(async(req, res) => {
  const postId = req.params.id;
  const likes = await Like.find({ post: postId }).populate({
    path: "user",
    select: "-password -__v"
  });
  if (likes.length === 0) {
    throw new ErrorResponse("post has no likes", 404);
  }
  res.status(200).json({ status: "success", likes });
})

/**
 * Unlike a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with a success message
 */
export const unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }
  const userLike = await Like.findOneAndDelete({
    post: post._id,
    user: userId,
  });
  if (!userLike) {
    throw new ErrorResponse("user does not like post", 403);
  }
  post.likes -= 1;
  await post.save();
  res.status(200).json({ status: "success", message: "post unliked" });
})

import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/util.utils.js";
import { ErrorResponse } from "../utils/error.utils.js";

/**
 * Like a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with the post object
 */
export const LikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }

  if (post.likedBy.hasOwnProperty(userId)) {
    throw new ErrorResponse("user already liked post", 403);
  }

  // increment the post likes and add user to liked by map
  post.likes += 1;
  post.likedBy.set(userId, true);

  await post.save();
  res.status(200).json({ status: "success", message: "post liked", post });
});

/**
 * Unlike a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with a success message
 */
export const unlikePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }

  if (!post.likedBy.has(userId.toString())) {
    throw new ErrorResponse("user does not like post", 403);
  }

  // reduce post likes by one and remove user from likedBy map
  post.likes -= 1;
  post.likedBy.delete(userId);

  await post.save();
  res.status(200).json({ status: "success", message: "post unliked" });
});

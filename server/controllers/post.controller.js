import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/util.utils.js";
import { ErrorResponse } from "../utils/error.utils.js";
import User from "../models/user.model.js";

/**
 * Create a post
 * @param {Object} req - The request body requires a post content and or image
 * @return - a response entity with the post object
 */
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  let post, imageName;

  if (!req.file) {
    post = await Post.create({
      user: req.user,
      content,
    });
  } else {
    imageName = req.file.filename;
    post = await Post.create({
      user: req.user,
      content,
      image: imageName,
      imageUrl: `uploads/${imageName}`,
    });
  }

  res.status(201).json({
    status: "success",
    message: "post created successfully",
    post: {
      id: post._id,
      content: post.content,
      image: post.image,
      imageUrl: post.imageUrl,
      username: post.user.username,
      displayname: post.user.displayname,
      profilePicture: post.user.avatar,
      createdAt: post.createdAt,
    },
  });
});

/**
 * Get all posts
 * @return - a response entity with all posts
 */
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "-password -__v")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", posts });
});

/**
 * Get all posts by a user
 * @param {Object} req - The request body requires a user id
 */
export const getPostsByUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) {
    return new ErrorResponse("user not found", 404);
  }

  const posts = await Post.find({ user: userId })
    .populate("user", "-password -__v")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json({ status: "success", posts });
});

/**
 * Get a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with the post object
 */
export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ErrorResponse("post id is required", 400);
  }

  const post = await Post.findOne({ _id: id }).populate("user", "-password -__v");
  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }

  res.status(200).json({ status: "success", post });
});

/**
 * Update a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with the updated post object
 */
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };

  // verify that req.body only contains content or image
  const validUpdates = ["content", "image"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    validUpdates.includes(update)
  );
  if (!isValidOperation) {
    throw new ErrorResponse("invalid updates", 400);
  }

  const post = await Post.findOneAndUpdate(filter, req.body, {
    new: true,
  }).populate("user", "-password -__v");

  if (!post) {
    throw new ErrorResponse("post not found", 404);
  }

  res.status(200).json({ status: "success", message: "post updated", post });
});

/**
 * Delete a post
 * @param {Object} req - The request body requires a post id
 * @return - a response entity with a success message
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });

  if (!post) {
    return new ErrorResponse("post not found", 404);
  }

  await Post.findByIdAndDelete(id).populate("user", "-password -__v");
  res.status(200).json({ status: "success", message: "post deleted" });
});

import { Post } from "../models/posts.js";
import { asyncHandler } from "../utils/utils.js";

// create a new post
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const imageName = req.file.filename;
  const post = await Post.create({
    userId: req.user,
    content,
    image: imageName
  });
  res.status(201).json({
    status: "success",
    message: "post created successfully",
    post
  })
})

// get all posts created
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("user", "-password -__v");
  res.status(200).json({ status: "success", posts });
})

// get a specific post
export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("user", "-password -__v");
  if (!post) {
    return res.status(404).json({ error: "post not found" });
  }
  res.status(200).json({ status: "success", post });
});

// update a post
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id, user: req.user };
  const post = await Post.findByOneAndUpdate(
    filter,
    req.body,
    { new: true })
    .populate("user", "-password -__v");
  
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  res.status(200).json({ status: "success", message: "post updated", post });
})

// delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id, user: req.user._id });
  if (!post) {
    return res.status(403).json({ error: "user does not own post" });
  }
  await Post.findByIdAndDelete(id).populate("user", "-password -__v");
  res.status(200).json({ status: "success", message: "post deleted" });
})

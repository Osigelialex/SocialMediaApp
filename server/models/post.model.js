import mongoose from "mongoose";

// Define the schema for the posts
const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: { type: String, default: null },
    imageUrl: { type: String, default: null },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    likedBy: { type: Map, of: Boolean, default: {} }
  },
  { timestamps: true }
);

// Define the schema for the comments
const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Define the schema for replies
const replySchema = new mongoose.Schema(
  {
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create the models for posts, likes, and comments
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);
const Reply = mongoose.model("Reply", replySchema);

export { Post, Comment, Reply };

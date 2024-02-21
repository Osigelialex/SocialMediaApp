import passport from "../config/passport.js";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getPostsByUser,
} from "../controllers/post.controller.js";
import {
  LikePost,
  unlikePost,
} from "../controllers/likes.controller.js";
import {
  createComment,
  getComments,
  deleteComment,
  createReply,
  getReplies,
  deleteReply,
} from "../controllers/comment.controller.js";
import { Router } from "express";
import { handleUpload } from "../middlewares/upload.middleware.js";

const router = Router();

// posts routes
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  handleUpload,
  createPost
);
router.get(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  getAllPosts
);
router.get(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  getPost
);
router.get(
  "/posts/user/:id",
  passport.authenticate("jwt", { session: false }),
  getPostsByUser
);
router.put(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  updatePost
);
router.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);

// likes routes
router.post(
  "/posts/:id/likes",
  passport.authenticate("jwt", { session: false }),
  LikePost
);
router.delete(
  "/posts/:id/likes",
  passport.authenticate("jwt", { session: false }),
  unlikePost
);

// comment routes
router.post(
  "/posts/:id/comments",
  passport.authenticate("jwt", { session: false }),
  createComment
);
router.get(
  "/posts/:id/comments",
  passport.authenticate("jwt", { session: false }),
  getComments
);
router.delete(
  "/posts/:id/comments/:commentId",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);

// reply routes
router.post(
  "/comments/:id/replies",
  passport.authenticate("jwt", { session: false }),
  createReply
);
router.get(
  "/comments/:id/replies",
  passport.authenticate("jwt", { session: false }),
  getReplies
);
router.delete(
  "/comments/:id/replies/:replyId",
  passport.authenticate("jwt", { session: false }),
  deleteReply
);

export default router;

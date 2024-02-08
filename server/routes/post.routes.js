import passport from "../config/passport.js";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";
import {
  LikePost,
  getPostLikes,
  unlikePost
} from "../controllers/likes.controller.js";
import {
  createComment,
  getComments,
  deleteComment,
  createReply,
  getReplies,
  deleteReply
} from "../controllers/comment.controller.js";
import { Router } from "express";
import { handleUpload } from "../middlewares/upload.middleware.js";

const router = Router();

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
router.post(
  "/posts/:id/likes",
  passport.authenticate("jwt", { session: false }),
  LikePost
);
router.get(
  "/posts/:id/likes",
  passport.authenticate("jwt", { session: false }),
  getPostLikes
);
router.delete(
  "/posts/:id/likes",
  passport.authenticate("jwt", { session: false }),
  unlikePost
);
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

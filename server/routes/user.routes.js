import upload from "../middlewares/uploadConf.middleware.js";
import { Router } from "express";
import passport from "passport";
import {
  getUsers,
  createUser,
  getMe,
  getUser,
  updateUser,
  deleteUser,
  searchUser,
} from "../controllers/user.controller.js";
import {
  followUser,
  unfollowUser,
  getFriends,
  getFollowSuggestions,
} from "../controllers/follower.controller.js";

const router = Router();

router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  getUsers
);

router.post(
  "/users",
  passport.authenticate("jwt", { session: false }),
  createUser
);

router.get("/me", passport.authenticate("jwt", { session: false }), getMe);

router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  searchUser
);

router.get(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  getUser
);

router.put(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  updateUser
);

router.get(
  "/users/:id/suggestions",
  passport.authenticate("jwt", { session: false }),
  getFollowSuggestions
);

router.delete(
  "/users/:id",
  passport.authenticate("jwt", { session: false }),
  deleteUser
);

router.post(
  "/users/:id/follow",
  passport.authenticate("jwt", { session: false }),
  followUser
);

router.delete(
  "/users/:id/unfollow",
  passport.authenticate("jwt", { session: false }),
  unfollowUser
);

router.get(
  "/users/:id/friends",
  passport.authenticate("jwt", { session: false }),
  getFriends
);

export default router;

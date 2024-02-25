import express from "express";
import passport from "../config/passport.js";
import { signup, login, refreshToken, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  logout
);

export default router;

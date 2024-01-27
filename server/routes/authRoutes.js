import express from "express";
import passport from "../config/passport.js";
import {
  signup,
  login,
  refreshToken,
  requestPasswordReset,
  requestEmailVerification,
  verifyEmail,
  resetPassword,
  logout,
} from "../controllers/AuthController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/request-email-verification", requestEmailVerification);
router.post("/verify-email", verifyEmail);
router.post("/request-password-reset", requestPasswordReset);
router.post("/password-reset", resetPassword);
router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  logout
);

export default router;

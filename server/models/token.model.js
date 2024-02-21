import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "4d",
  },
});

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const emailVerificationToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const Blacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
const ResetToken = mongoose.model("ResetToken", resetTokenSchema);
const EmailVerificationToken = mongoose.model(
  "EmailVerificationToken",
  emailVerificationToken
);

export { Blacklist, ResetToken, EmailVerificationToken };

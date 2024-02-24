import mongoose, { model } from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    displayname: { type: String, default: null },
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be 6 characters or longer"],
    },
    bio: { type: String, default: null },
    location: { type: String, default: null },
    profilePicture: { type: String, default: null },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS), (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    next();
  });
});

export default model("User", userSchema);

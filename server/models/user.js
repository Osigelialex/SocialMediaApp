import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema({
  displayname: { type: String, default: null }, 
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  bio: { type: String, default: null },
  location: { type: String, default: null },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 }
}, {timestamps: true});

export default model("User", userSchema);

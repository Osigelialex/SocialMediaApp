import mongoose, { model } from 'mongoose';

const followerSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {timestamps: true});

export default model('Follow', followerSchema);

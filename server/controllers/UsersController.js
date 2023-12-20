import User from "../models/user.js";
import bcrypt from "bcryptjs";

const UserController = {
  getUsers: async (req, res) => {
    try {
      const users = await User.find({}).select("-password -__v");
      if (!users) {
        return res.status(404).json({ message: "no users found" });
      }
      res.status(200).json({ status: "success", users });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  },
  getUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select("-password -__v");

      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json({ status: "success", user });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      // prevent user from updating username
      if (req.body.username) {
        return res.status(400).json({ error: "username cannot be updated" });
      }

      // prevent user from updating password
      if (req.body.password) {
        return res.status(400).json({ error: "password cannot be updated" });
      }

      const user = await User.findByIdAndUpdate(id, req.body, { new: true });

      if (!user) {
        res.status(404).json({ error: "user not found" });
      }

      res.status(200).json({
        status: "success",
        message: "user updated successfully",
        user: {
          id: user._id,
          username: user.username,
          displayname: user.displayname,
          email: user.email,
          bio: user.bio,
          location: user.location,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  },
  createUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!(username && email && password)) {
        return res.status(400).json({ error: "all fields are required" });
      }

      // check for user with same email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "user already exists with email" });
      }

      // check for user with same username
      const userWithUsername = await User.findOne({ username });
      if (userWithUsername) {
        return res
          .status(400)
          .json({ error: "user already exists with username" });
      }

      // encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // create new user
      const user = await User.create({
        username,
        email,
        password: encryptedPassword,
      });

      res.status(201).json({
        status: "success",
        message: "user created successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "internal server error" });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json({
        status: "success",
        message: "user deleted successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "internal server error" });
    }
  },
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user).select("-password -__v");
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      res.status(200).json({ status: "success", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },
};

export default UserController;

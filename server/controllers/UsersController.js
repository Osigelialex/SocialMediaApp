import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UsersController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // confirm that all fields were entered
      if (!(username && email && password)) {
        return res.status(400).json({ error: "all fields required" });
      }

      // check if a user exists with the entered email
      const existingUserWithEmail = await User.findOne({ email });
      if (existingUserWithEmail) {
        return res
          .status(409)
          .json({ error: "user with email already exists" });
      }

      // check if a user exists with the entered username
      const existingUserWithUsername = await User.findOne({ username });
      if (existingUserWithUsername) {
        return res
          .status(409)
          .json({ error: "user with username already exists" });
      }

      // encrypt password before storing in database
      const encryptedPassword = await bcrypt.hash(password, 10);

      // create new user
      const user = await create({
        username,
        email,
        password: encryptedPassword,
      });

      res.status(201).json({ 
        status: "success",
        message: "registration successful",
        user: {
          id: user._id,
          username,
          email
        }
      });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "internal server error" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // verify that email and password were entered correctly
      if (!(email && password)) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // check for an existing user with the provided email and password
      const user = await User.findOne({ email });

      // check if user entered the right password
      if (!(user && (await compare(password, user.password)))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // generate jwt token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        { expiresIn: "2h" }
      );

      // associate token with user
      user.token = token;

      return res.status(200).json({
        status: "success",
        message: "login successful. Welcome back",
        accessToken: token,
        user: {
          id: user._id,
          username: user.username,
          email
        }
       });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },
  getUsers: async (req, res) => {
    try {
      // get all user from db
      const users = await User.find({}).select("username email -_id");
      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  },
};

export default UsersController;

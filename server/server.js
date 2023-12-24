import express, { json, urlencoded } from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT;
const DB_URL = "mongodb://0.0.0.0/socialMediaAPI";

await mongoose.connect(DB_URL);

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);

app.listen(port, () => console.log(`server listening on ${port}`));

export default app;

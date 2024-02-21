import express, { json, urlencoded } from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
dotenv.config();

const app = express();
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await mongoose.connect(process.env.DB_URL);

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true, limit: "13mb", parameterLimit: 20000 }));
app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  const responseBody = {
    status: "fail",
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  };
  console.log("ERROR: ", responseBody);
  res.status(err.statusCode).json(responseBody);
});

app.listen(port, () => console.log(`server listening on ${port}`));

export default app;

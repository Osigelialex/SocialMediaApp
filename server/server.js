import express, { json, urlencoded } from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT;
const DB_URL = "mongodb://0.0.0.0/socialMediaAPI";

await mongoose.connect(DB_URL);

app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api", routes);

app.listen(port, () => console.log(`server listening on ${port}`));

export default app;

import express, { json, urlencoded } from "express";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';
dotenv.config();

const app = express();
const port = process.env.PORT;
const DB_URL = "mongodb://0.0.0.0/socialMediaAPI";

await mongoose.connect(DB_URL);


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      title: 'My Social Media API',
      version: '1.0.0',
      description: 'A social media backend api',
    },
    components: {
      securitySchemes: {
        jwt: {
          type: 'apiKey',
          name: 'X-Auth-Token',
          in: 'header',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['server/routes/*.js'],
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use('/uploads', express.static('Images'));
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", postRoutes);

app.listen(port, () => console.log(`server listening on ${port}`));

export default app;

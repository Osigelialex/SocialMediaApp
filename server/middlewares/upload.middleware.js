import upload from "./uploadConf.middleware.js";
import multer from "multer";
import { ErrorResponse } from "../utils/error.utils.js";

/**
 * Handles file uploads and returns respective error messages
 * @param {Function} next - The next middleware function
 */
export const handleUpload = (req, res, next) => {
  upload.single("file")(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return next(new ErrorResponse(err.message, 400));
    } else if (err) {
      return next(new ErrorResponse(err.message, 400));
    }
    next();
  });
};

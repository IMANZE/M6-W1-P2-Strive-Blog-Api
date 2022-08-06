import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createError from "http-errors";

export const cloudinarySendData = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "blog /avatar",
    },
  }),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, next) => {
    if (file.mimetype !== "image/jpeg") {
      return next(createError(400, "only images allowed"));
    } else {
      next(null, true);
    }
  },
}).single("cover");

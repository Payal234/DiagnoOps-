import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const hasCloudinaryConfig = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const storage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "lab_documents",
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx"],
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/lab_documents");
      },
      filename: (req, file, cb) => {
        const safeOriginal = String(file.originalname || "file").replace(/[^A-Za-z0-9_.-]/g, "_");
        cb(null, `${Date.now()}_${safeOriginal}`);
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Allow pdf, doc, docx, jpg, png, jpeg
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG`));
    }
  },
});

export default upload;
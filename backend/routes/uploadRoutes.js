import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import path from "path";

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddd3rlobl',
  api_key: process.env.CLOUDINARY_API_KEY || '724177814542557',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'g7m_XrgeuFm2mWBdcsa6pxbx0D4'
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
}).single("image"); // Changed from "file" to "image" to match frontend

// Error handling middleware
const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "File size is too large. Maximum size is 5MB." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Single file upload
router.post("/cloudinary", handleUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
      folder: "CAMSHOP",
      transformation: [{ width: 1000, height: 1000, crop: "limit" }]
    });

    res.json({
      image: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Error uploading to Cloudinary",
      error: error.message 
    });
  }
});

// Multiple files upload
const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpe?g|png|webp/;
    const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && mimetypes.test(mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
}).array("files", 5);

// Error handling middleware for multiple uploads
const handleMultipleUpload = (req, res, next) => {
  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "File size is too large. Maximum size is 5MB per file." });
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: "Too many files. Maximum is 5 files." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post("/cloudinary/multiple", handleMultipleUpload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "CAMSHOP",
        transformation: [{ width: 1000, height: 1000, crop: "limit" }]
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    res.json(uploadedFiles);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Error uploading to Cloudinary",
      error: error.message 
    });
  }
});

export default router;

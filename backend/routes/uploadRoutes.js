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
}).array("image", 5); // Changed to array to handle multiple files, max 5

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

// File upload route - handles both single and multiple files
router.post("/cloudinary", handleUpload, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Process each file
    const uploadPromises = req.files.map(async (file) => {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString("base64");
      const dataURI = "data:" + file.mimetype + ";base64," + b64;

      // Upload to Cloudinary with a timeout
      const uploadPromise = cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
        folder: "CAMSHOP",
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        timeout: 60000 // 60 second timeout
      });

      try {
        const result = await Promise.race([
          uploadPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Upload timeout')), 60000)
          )
        ]);

        return {
          image: result.secure_url,
          public_id: result.public_id
        };
      } catch (error) {
        console.error("Individual upload error:", error);
        throw error;
      }
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    res.json({
      images: results.map(r => r.image),
      public_ids: results.map(r => r.public_id)
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Error uploading to Cloudinary",
      error: error.message 
    });
  }
});

export default router;

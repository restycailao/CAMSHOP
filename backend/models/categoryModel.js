import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  cameraType: {
    type: String,
    enum: [
      "DSLR (Digital Single-Lens Reflex) Cameras",
      "Compact/Point-and-Shoot Cameras",
      "Action Cameras",
      "360-Degree Cameras",
      "Instant Cameras",
    ],
    required: true,
  },
  sensorSize: {
    type: String,
    enum: [
      "Full-Frame Cameras",
      "APS-C Cameras",
      "Micro Four Thirds Cameras",
      "Medium Format Cameras",
    ],
    required: true,
  },
  primaryUseCase: {
    type: String,
    enum: [
      "Photography",
      "Videography",
      "Vlogging Cameras",
      "Professional Cameras",
      "Travel Cameras",
    ],
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);

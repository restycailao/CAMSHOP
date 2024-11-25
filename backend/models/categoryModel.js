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
      "DSLR",
      "Mirrorless",
      "Point-and-Shoot",
      "Action Camera",
      "360-Degree Camera",
      "Instant Camera",
      "Film Camera",
      "Medium Format"
    ],
    required: true,
  },
  sensorSize: {
    type: String,
    enum: [
      "Full-Frame",
      "APS-C",
      "Micro Four Thirds",
      "Medium Format",
      "1-inch",
      "1/1.7-inch",
      "1/2.3-inch"
    ],
    required: true,
  },
  primaryUseCase: {
    type: String,
    enum: [
      "Professional",
      "Amateur",
      "Hobbyist",
      "Travel",
      "Sports",
      "Wildlife",
      "Studio",
      "Street"
    ],
    required: true,
  },
});

export default mongoose.model("Category", categorySchema);

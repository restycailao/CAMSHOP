import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, cameraType, sensorSize, primaryUseCase } = req.body;

  if (!name || !cameraType || !sensorSize || !primaryUseCase) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  try {
    const category = await new Category({ 
      name, 
      cameraType, 
      sensorSize, 
      primaryUseCase 
    }).save();
    
    res.status(201).json(category);
  } catch (error) {
    console.error("Category creation error:", error);
    res.status(400).json({ message: error.message || "Error creating category" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, cameraType, sensorSize, primaryUseCase } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;
    category.cameraType = cameraType;
    category.sensorSize = sensorSize;
    category.primaryUseCase = primaryUseCase;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndRemove(req.params.categoryId);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};

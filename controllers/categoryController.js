// TODO: Mostafa Shanab — Category Controller
// - getCategories: return all categories
// - getCategory: find by ID, 404 if not found
// - getProductsByCategory: find all products where category matches req.params.id, populate category
// - createCategory: validate name required, create
// - updateCategory: findByIdAndUpdate, 404 if not found
// - deleteCategory: findByIdAndDelete, 404 if not found
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { AppError } from "../utils/classError.js";

// GET /categories
// Public — returns every category in the database
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res
      .status(200)
      .json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// GET /categories/:id
// Public — returns one category by its MongoDB _id
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// GET /categories/:id/products
// Public — returns all products that belong to a specific category
export const getProductsByCategory = async (req, res, next) => {
  try {
    // First make sure the category actually exists
    const category = await Category.findById(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    // Find every product whose category field matches this id
    // .populate("category") replaces the ObjectId with the full category document
    const products = await Product.find({ category: req.params.id }).populate(
      "category",
    );

    res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// POST /categories
// Admin only — creates a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // name is required — reject early with a clear message
    if (!name) throw new AppError("Category name is required", 400);

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    // MongoDB duplicate key error code is 11000
    // This happens when someone tries to create a category with a name that already exists
    if (error.code === 11000) {
      return next(new AppError("Category name already exists", 400));
    }
    next(error);
  }
};

// PATCH /categories/:id
// Admin only — updates name and/or description of an existing category
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // new: true -> return the updated doc, not the old one
    );
    if (!category) throw new AppError("Category not found", 404);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return next(new AppError("Category name already exists", 400));
    }
    next(error);
  }
};

// DELETE /categories/:id
// Admin only — removes a category from the database
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

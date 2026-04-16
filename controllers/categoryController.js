import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { AppError } from "../utils/classError.js";

const MAX_LIMIT = 100;
const ALLOWED_CATEGORY_FIELDS = ["name", "description"];

const clampPagination = (page, limit) => ({
  pageNum: Math.max(1, parseInt(page) || 1),
  limitNum: Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 10)),
});

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
// Public — returns all products that belong to a specific category (paginated)
export const getProductsByCategory = async (req, res, next) => {
  try {
    // First make sure the category actually exists
    const category = await Category.findById(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    const { pageNum, limitNum } = clampPagination(req.query.page, req.query.limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = { category: req.params.id };
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category").skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
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
    const updates = ALLOWED_CATEGORY_FIELDS.reduce((acc, key) => {
      if (req.body[key] !== undefined) acc[key] = req.body[key];
      return acc;
    }, {});

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
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
    const inUse = await Product.countDocuments({ category: req.params.id });
    if (inUse > 0) {
      throw new AppError(
        `Cannot delete category: ${inUse} product(s) reference it`,
        400,
      );
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new AppError("Category not found", 404);

    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

import mongoose from "mongoose";
import Product from "../models/Product.js"

const MAX_LIMIT = 100;
const ALLOWED_PRODUCT_FIELDS = ["name", "description", "price", "stock", "category"];

const clampPagination = (page, limit) => ({
    pageNum: Math.max(1, parseInt(page) || 1),
    limitNum: Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || 10)),
});


export const getProducts = async (req, res, next) => {
    try {
        const { name, categoryId, page, limit, sort } = req.query

        // filtration
        let filter = {}

        if (name) {
            filter.name = { $regex: name, $options: "i" }
        }

        if (categoryId) {
            filter.category = categoryId
        }

        // pagination
        const { pageNum, limitNum } = clampPagination(page, limit);

        let skip = limitNum * (pageNum - 1)

        // count
        const totalProducts = await Product.countDocuments(filter)
        let numberOfPages = Math.ceil(totalProducts / limitNum)

        // query
        let query = Product.find(filter).populate('category')

        //  sorting 
        if (sort) {
            query = query.sort(sort)
        }

        // pagination 
        query = query.skip(skip).limit(limitNum)

        let products = await query

        res.json({
            success: true,
            data: {
                currentPage: pageNum,
                numberOfPages,
                limit: limitNum,
                products
            }
        })

    } catch (error) {
        next(error)
    }
};

export const getProduct = async (req, res, next) => {
    try {
        let { id } = req.params
        if (!id) {
            return res.status(400).json({ success: false, message: "Enter Product ID " })
        }
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }
        let product = await Product.findById(id).populate('category')
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
        res.json({ success: true, data: product })
    } catch (error) {
        next(error)
    }

}

export const createProduct = async (req, res, next) => {
    try {
        let { name, description, price, stock, category } = req.body

        if (!name || price === undefined || !category) {
            return res.status(400).json({ success: false, message: "name , price and category are required" })
        }
        if (Number(price) < 0) {
            return res.status(400).json({ success: false, message: "price must be non-negative" })
        }
        if (stock !== undefined && Number(stock) < 0) {
            return res.status(400).json({ success: false, message: "stock must be non-negative" })
        }
        let productObj = {
            name,
            price,
            category
        }
        if (description) productObj.description = description
        if (stock !== undefined) productObj.stock = stock
        let product = await Product.create(productObj)

        res.status(201).json({ success: true, message: "product created successfully", data: product })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req, res, next) => {

    try {
        let { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }

        const updates = ALLOWED_PRODUCT_FIELDS.reduce((acc, key) => {
            if (req.body[key] !== undefined) acc[key] = req.body[key];
            return acc;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update"
            });
        }

        if (updates.price !== undefined && Number(updates.price) < 0) {
            return res.status(400).json({ success: false, message: "price must be non-negative" })
        }
        if (updates.stock !== undefined && Number(updates.stock) < 0) {
            return res.status(400).json({ success: false, message: "stock must be non-negative" })
        }

        let product = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

        if (!product) {
            return res.status(404).json({ success: false, message: "There is no product with that id " })
        }

        res.json({ success: true, message: "Product updated successfully", data: product })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req, res, next) => {

    try {
        let { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID"
            });
        }
        let product = await Product.findByIdAndDelete(id)

        if (!product) {
            return res.status(404).json({ success: false, message: "There is no product with that id " })
        }

        res.json({ success: true, message: "Product Deleted successfully", data: product })
    } catch (error) {
        next(error)
    }
}


// TODO: Ahmed Gaber — Product Controller
// - getProducts: search by name (regex), filter by category, sort (comma-separated, "-" prefix for desc), pagination (page/limit). Populate category.
// - getProduct: find by ID, populate category, 404 if not found
// - createProduct: validate name+price+category required, create
// - updateProduct: findByIdAndUpdate, 404 if not found
// - deleteProduct: findByIdAndDelete, 404 if not found

import mongoose from "mongoose";
import Product from "../models/Product.js"


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
        let pageNum = parseInt(page) || 1
        let limitNum = parseInt(limit) || 10

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

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: "name , price and category are required" })
        }
        let productObj = {
            name,
            price,
            category
        }
        if (description) productObj.description = description
        if (stock !== undefined) productObj.stock = stock
        let product = await Product.create(productObj)

        res.json({ success: true, message: "product created successfully", data: product })
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

        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No data provided to update"
            });
        }

        let product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

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


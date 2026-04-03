// TODO: Mostafa Shanab — Category API Documentation
// Export paths and schemas for the following endpoints:
//
// Schemas to define:
//   - Category: { _id, name, description }
//   - CreateCategoryInput: { name (required), description }
//   - UpdateCategoryInput: { name, description }
//
// Paths to document:
//   GET    /categories              — public, returns all categories (200)
//   GET    /categories/:id          — public, returns single Category (200), 404 if not found
//   GET    /categories/:id/products — public, returns products in this category (200)
//   POST   /categories              — admin only, body: CreateCategoryInput, returns Category (201)
//   PATCH  /categories/:id          — admin only, body: UpdateCategoryInput, returns Category (200)
//   DELETE /categories/:id          — admin only, returns success message (200)
//
// Follow the same structure as config/swagger/order.js

export const paths = {};

export const schemas = {};

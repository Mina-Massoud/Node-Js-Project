// TODO: Ahmed Gaber — Product API Documentation
// Export paths and schemas for the following endpoints:
//
// Schemas to define:
//   - Product: { _id, name, description, price, stock, category (ref), createdAt, updatedAt }
//   - CreateProductInput: { name (required), description, price (required), stock, category (required) }
//   - UpdateProductInput: { name, description, price, stock, category }
//
// Paths to document:
//   GET    /products     — public, query: name (search), category (filter), sort, page, limit
//   GET    /products/:id — public, returns single Product (200), 404 if not found
//   POST   /products     — admin only, body: CreateProductInput, returns Product (201)
//   PATCH  /products/:id — admin only, body: UpdateProductInput, returns Product (200)
//   DELETE /products/:id — admin only, returns success message (200)
//
// Follow the same structure as config/swagger/order.js

export const paths = {};

export const schemas = {};

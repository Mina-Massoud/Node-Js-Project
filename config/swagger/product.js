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

// TODO: Ahmed Gaber — Product API Documentation

export const schemas = {
    Product: {
        type: "object",
        properties: {
            _id: { type: "string", example: "64f1c2e8a9b1c2d3e4f56789" },
            name: { type: "string", example: "iPhone 14" },
            description: { type: "string", example: "Latest Apple smartphone" },
            price: { type: "number", example: 999 },
            stock: { type: "number", example: 10 },
            category: {
                type: "string",
                example: "64f1c2e8a9b1c2d3e4f11111"
            },
            createdAt: {
                type: "string",
                format: "date-time",
                example: "2026-04-08T10:00:00.000Z"
            },
            updatedAt: {
                type: "string",
                format: "date-time",
                example: "2026-04-08T10:00:00.000Z"
            }
        }
    },

    CreateProductInput: {
        type: "object",
        required: ["name", "price", "category"],
        properties: {
            name: { type: "string", example: "iPhone 14" },
            description: { type: "string", example: "Latest Apple smartphone" },
            price: { type: "number", example: 999 },
            stock: { type: "number", example: 10 },
            category: {
                type: "string",
                example: "64f1c2e8a9b1c2d3e4f11111"
            }
        }
    },

    UpdateProductInput: {
        type: "object",
        properties: {
            name: { type: "string", example: "iPhone 15" },
            description: { type: "string", example: "Updated model" },
            price: { type: "number", example: 1099 },
            stock: { type: "number", example: 20 },
            category: {
                type: "string",
                example: "64f1c2e8a9b1c2d3e4f11111"
            }
        }
    }
};

export const paths = {
    "/products": {
        get: {
            tags: ["Products"],
            summary: "Get all products",
            description: "Public endpoint with search, filter, sort and pagination",
            parameters: [
                {
                    name: "name",
                    in: "query",
                    schema: { type: "string" },
                    description: "Search by product name"
                },
                {
                    name: "categoryId",
                    in: "query",
                    schema: { type: "string" },
                    description: "Filter by category ID"
                },
                {
                    name: "sort",
                    in: "query",
                    schema: { type: "string" },
                    description: "Sort fields (e.g. price or -price)"
                },
                {
                    name: "page",
                    in: "query",
                    schema: { type: "integer", default: 1 }
                },
                {
                    name: "limit",
                    in: "query",
                    schema: { type: "integer", default: 10 }
                }
            ],
            responses: {
                200: {
                    description: "Products fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: {
                                        type: "object",
                                        properties: {
                                            currentPage: { type: "number" },
                                            numberOfPages: { type: "number" },
                                            products: {
                                                type: "array",
                                                items: { $ref: "#/components/schemas/Product" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        post: {
            tags: ["Products"],
            summary: "Create a new product",
            description: "Admin only",
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CreateProductInput" }
                    }
                }
            },
            responses: {
                201: {
                    description: "Product created successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    data: { $ref: "#/components/schemas/Product" }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    "/products/{id}": {
        get: {
            tags: ["Products"],
            summary: "Get single product",
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Product fetched successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean" },
                                    data: { $ref: "#/components/schemas/Product" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Product not found"
                }
            }
        },

        patch: {
            tags: ["Products"],
            summary: "Update product",
            description: "Admin only",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/UpdateProductInput" }
                    }
                }
            },
            responses: {
                200: {
                    description: "Product updated successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean" },
                                    data: { $ref: "#/components/schemas/Product" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Product not found"
                }
            }
        },

        delete: {
            tags: ["Products"],
            summary: "Delete product",
            description: "Admin only",
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Product deleted successfully",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    success: { type: "boolean", example: true },
                                    message: { type: "string", example: "Product Deleted successfully" }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: "Product not found"
                }
            }
        }
    }
};
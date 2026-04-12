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

// Mostafa Shanab — Category API Documentation
export const paths = {
  "/categories": {
    get: {
      tags: ["Categories"],
      summary: "Get all categories",
      description: "Public endpoint. Returns a list of all categories.",
      responses: {
        200: {
          description: "Categories fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  count: { type: "integer", example: 3 },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Category" },
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Categories"],
      summary: "Create a new category",
      description: "Admin only",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCategoryInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Category created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error (e.g. missing name or duplicate name)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized — token missing or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Forbidden — admin only",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/categories/{id}": {
    get: {
      tags: ["Categories"],
      summary: "Get a single category",
      description: "Public endpoint. Returns one category by its ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Category ID",
        },
      ],
      responses: {
        200: {
          description: "Category fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
        404: {
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    patch: {
      tags: ["Categories"],
      summary: "Update a category",
      description: "Admin only",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Category ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCategoryInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Category updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error (e.g. duplicate name)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized — token missing or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Forbidden — admin only",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },

    delete: {
      tags: ["Categories"],
      summary: "Delete a category",
      description: "Admin only",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Category ID",
        },
      ],
      responses: {
        200: {
          description: "Category deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: {
                    type: "string",
                    example: "Category deleted successfully",
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized — token missing or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        403: {
          description: "Forbidden — admin only",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },

  "/categories/{id}/products": {
    get: {
      tags: ["Categories"],
      summary: "Get all products under a category",
      description:
        "Public endpoint. Returns every product whose category field matches the given category ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Category ID",
        },
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
                  count: { type: "integer", example: 5 },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Category not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};

export const schemas = {
  Category: {
    type: "object",
    properties: {
      _id: { type: "string", example: "664f1b2c9a4e2d001f8b4567" },
      name: { type: "string", example: "Electronics" },
      description: {
        type: "string",
        example: "All electronic devices and accessories",
      },
    },
  },

  CreateCategoryInput: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", example: "Electronics" },
      description: {
        type: "string",
        example: "All electronic devices and accessories",
      },
    },
  },

  UpdateCategoryInput: {
    type: "object",
    properties: {
      name: { type: "string", example: "Updated Electronics" },
      description: {
        type: "string",
        example: "Updated description",
      },
    },
  },
};

// Noura Ali — Order API Documentation

// Ahmed Gaber — Product API Documentation

export const paths = {
  "/products": {
    get: {
      tags: ["Products"],
      summary: "List products (paginated)",
      description:
        "Public endpoint. Supports search by name, filter by category, sorting, and pagination.",
      parameters: [
        {
          name: "name",
          in: "query",
          schema: { type: "string" },
          description: "Search by product name",
        },
        {
          name: "categoryId",
          in: "query",
          schema: { type: "string" },
          description: "Filter by category ID",
        },
        {
          name: "sort",
          in: "query",
          schema: { type: "string" },
          description: "Sort fields (e.g. price or -price)",
        },
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
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
                  data: {
                    type: "object",
                    properties: {
                      currentPage: { type: "number" },
                      numberOfPages: { type: "number" },
                      products: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Product" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid query parameters",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
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
            schema: { $ref: "#/components/schemas/CreateProductInput" },
          },
        },
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
                  data: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized",
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

  "/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get a single product",
      description: "Public endpoint",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Product ID",
        },
      ],
      responses: {
        200: {
          description: "Product fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid Product ID",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Product not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
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
          schema: { type: "string" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProductInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error / invalid ID",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized",
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
          description: "Product not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
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
          schema: { type: "string" },
        },
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
                  message: {
                    type: "string",
                    example: "Product Deleted successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid Product ID",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Unauthorized",
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
          description: "Product not found",
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
  Product: {
    type: "object",
    properties: {
      _id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      stock: { type: "number" },
      category: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },

  CreateProductInput: {
    type: "object",
    required: ["name", "price", "category"],
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      stock: { type: "number" },
      category: { type: "string" },
    },
  },

  UpdateProductInput: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number" },
      stock: { type: "number" },
      category: { type: "string" },
    },
  },
};
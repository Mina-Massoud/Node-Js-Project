// Noura Ali — Order API Documentation

export const paths = {
  "/orders": {
    get: {
      tags: ["Orders"],
      summary: "List orders (paginated)",
      description:
        "Admin sees all orders. Regular users see only their own orders.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          description: "Page number",
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10 },
          description: "Items per page",
        },
        {
          name: "status",
          in: "query",
          schema: {
            type: "string",
            enum: [
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ],
          },
          description: "Filter by order status",
        },
      ],
      responses: {
        200: {
          description: "Paginated list of orders",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  total: { type: "integer" },
                  page: { type: "integer" },
                  pages: { type: "integer" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Order" },
                  },
                },
              },
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
      },
    },
    post: {
      tags: ["Orders"],
      summary: "Create a new order",
      description: "Authenticated users can create orders.",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateOrderInput" },
          },
        },
      },
      responses: {
        201: {
          description: "Order created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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
      },
    },
  },
  "/orders/{id}": {
    get: {
      tags: ["Orders"],
      summary: "Get a single order",
      description:
        "Admin can view any order. Regular users can only view their own.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Order ID",
        },
      ],
      responses: {
        200: {
          description: "Order details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
                },
              },
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
          description: "Access denied — order belongs to another user",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        404: {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    put: {
      tags: ["Orders"],
      summary: "Replace an order (admin only)",
      description: "Full order replacement. Requires admin role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Order ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateOrderInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Order updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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
        404: {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    patch: {
      tags: ["Orders"],
      summary: "Update order status (admin only)",
      description: "Partial update — changes status only. Requires admin role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Order ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateStatusInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Order status updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/Order" },
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
        404: {
          description: "Order not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Orders"],
      summary: "Delete an order (admin only)",
      description: "Requires admin role.",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Order ID",
        },
      ],
      responses: {
        200: {
          description: "Order deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Order deleted successfully" },
                },
              },
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
          description: "Order not found",
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
  OrderItem: {
    type: "object",
    required: ["product", "quantity", "price"],
    properties: {
      product: { type: "string", description: "Product ID" },
      quantity: { type: "integer", minimum: 1 },
      price: { type: "number", minimum: 0 },
    },
  },
  Order: {
    type: "object",
    properties: {
      _id: { type: "string" },
      user: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      items: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      totalPrice: { type: "number" },
      status: {
        type: "string",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
      shippingAddress: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  CreateOrderInput: {
    type: "object",
    required: ["items", "shippingAddress"],
    properties: {
      items: {
        type: "array",
        minItems: 1,
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      shippingAddress: { type: "string" },
    },
  },
  UpdateOrderInput: {
    type: "object",
    required: ["items", "shippingAddress", "status"],
    properties: {
      items: {
        type: "array",
        minItems: 1,
        items: { $ref: "#/components/schemas/OrderItem" },
      },
      shippingAddress: { type: "string" },
      status: {
        type: "string",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
    },
  },
  UpdateStatusInput: {
    type: "object",
    required: ["status"],
    properties: {
      status: {
        type: "string",
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      },
    },
  },
};

// Youssef Tarek — User API Documentation

export const paths = {
  "/users/register": {
    post: {
      tags: ["Users"],
      summary: "Register a new user",
      description: "Public endpoint. Creates a new user and returns a JWT token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterInput" },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "User registered successfully" },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/UserSummary" },
                      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Validation error or duplicate email/phone",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/users/login": {
    post: {
      tags: ["Users"],
      summary: "Login user",
      description: "Public endpoint. Authenticates user and returns a JWT token.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginInput" },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  message: { type: "string", example: "Login successful" },
                  data: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/UserSummary" },
                      token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Missing email or password",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        401: {
          description: "Invalid email or password",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get logged-in user's profile",
      description: "Returns the authenticated user's full profile.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User profile retrieved",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { $ref: "#/components/schemas/UserProfile" },
                },
              },
            },
          },
        },
        401: {
          description: "Token not provided or invalid",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Get all users (admin only)",
      description: "Requires admin role. Returns all users.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "List of users",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  results: { type: "integer" },
                  data: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserProfile" },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Token not provided or invalid",
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
};

export const schemas = {
  RegisterInput: {
    type: "object",
    required: ["firstName", "lastName", "email", "password", "age", "phone", "address"],
    properties: {
      firstName: { type: "string", example: "John" },
      lastName: { type: "string", example: "Doe" },
      email: { type: "string", format: "email", example: "john@example.com" },
      password: { type: "string", example: "strongpassword" },
      age: { type: "integer", example: 25 },
      phone: { type: "string", example: "1234567890" },
      address: { type: "string", example: "123 Main St" },
      role: {
        type: "string",
        enum: ["admin", "user"],
        default: "user",
        description: "Optional, defaults to 'user'",
      },
    },
  },
  LoginInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "john@example.com" },
      password: { type: "string", example: "strongpassword" },
    },
  },
  UserSummary: {
    type: "object",
    properties: {
      id: { type: "string", example: "64f3a1c2e4b0e12345abcd67" },
      firstName: { type: "string", example: "John" },
      lastName: { type: "string", example: "Doe" },
      email: { type: "string", example: "john@example.com" },
      role: { type: "string", example: "user" },
    },
  },
  UserProfile: {
    type: "object",
    properties: {
      id: { type: "string", example: "64f3a1c2e4b0e12345abcd67" },
      firstName: { type: "string", example: "John" },
      lastName: { type: "string", example: "Doe" },
      email: { type: "string", example: "john@example.com" },
      age: { type: "integer", example: 25 },
      phone: { type: "string", example: "1234567890" },
      address: { type: "string", example: "123 Main St" },
      role: { type: "string", example: "user" },
    },
  },
};

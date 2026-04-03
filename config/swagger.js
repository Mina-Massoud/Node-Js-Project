import { paths as orderPaths, schemas as orderSchemas } from "./swagger/order.js";
import { paths as userPaths, schemas as userSchemas } from "./swagger/user.js";
import {
  paths as productPaths,
  schemas as productSchemas,
} from "./swagger/product.js";
import {
  paths as categoryPaths,
  schemas as categorySchemas,
} from "./swagger/category.js";

const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "E-Commerce API",
    version: "1.0.0",
    description: "E-Commerce Platform Backend API",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5431}`,
      description: "Development",
    },
  ],
  tags: [
    { name: "Users", description: "Authentication and user management" },
    { name: "Products", description: "Product catalog" },
    { name: "Categories", description: "Product categories" },
    { name: "Orders", description: "Order management" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
        },
      },
      ...userSchemas,
      ...productSchemas,
      ...categorySchemas,
      ...orderSchemas,
    },
  },
  paths: {
    ...userPaths,
    ...productPaths,
    ...categoryPaths,
    ...orderPaths,
  },
};

export default swaggerSpec;

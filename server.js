import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/db.js";
import swaggerSpec from "./config/swagger.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import rateLimiter from "./middlewares/rateLimiter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(logger);
app.use(rateLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

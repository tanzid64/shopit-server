import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./utils/config.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
configDotenv();
const app = express();
const port = 3000;
connectDB();
// using cache
export const nodeCache = new NodeCache();
// using middleware
app.use(express.json());
// using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/uploads", express.static("uploads"));
//! Error handling middleware
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});

import express from "express";
import { configDotenv } from "dotenv";
import { connectDB } from "./utils/config.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";
// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoutes from "./routes/stats.js";
configDotenv();
const app = express();
app.use(morgan("dev"));
const port = 3000;
connectDB();
// using stripe
const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);
// using cache
export const nodeCache = new NodeCache();
// using middleware
app.use(express.json());
// using routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/uploads", express.static("uploads"));
//! Error handling middleware
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});

import express from "express";
import { config } from "dotenv";
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

config({
  path: "./.env",
});
const app = express();
app.use(morgan("dev"));
const port = 3000;
connectDB(process.env.MONGO_URI || "");
// using stripe
const stripeKey = process.env.STRIPE_KEY || "";
export const stripe = new Stripe(stripeKey);
// using cache
export const nodeCache = new NodeCache();

// using middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Site Working");
});
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
  if (process.env.NODE_ENV === "Production") {
    {
      console.log(
        `Server is working on https://shopit-server-hbch.onrender.com/`
      );
    }
  } else {
    console.log(`Server is working on http://localhost:${port}`);
  }
});

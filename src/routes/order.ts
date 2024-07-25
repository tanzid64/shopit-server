import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newOrder, myOrders, allOrders } from "../controllers/order.js";
const app = express.Router();

// POST /api/v1/orders/new
app.post("/new", newOrder);
// GET /api/v1/orders/my
app.get("/my", myOrders);
// GET /api/v1/orders/all
app.get("/all", adminOnly, allOrders);

export default app;

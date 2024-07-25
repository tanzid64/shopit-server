import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  newOrder,
  myOrders,
  allOrders,
  getOrderDetails,
  processOrder,
  deleteOrder,
} from "../controllers/order.js";
const app = express.Router();

// POST /api/v1/orders/new
app.post("/new", newOrder);
// GET /api/v1/orders/my
app.get("/my", myOrders);
// GET /api/v1/orders/all
app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
  .get(getOrderDetails)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;

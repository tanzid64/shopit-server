import express from "express";

import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";
const app = express.Router();
// POST /api/v1/payments/coupon/new
app.post("/coupon/new",adminOnly, newCoupon);
// GET /api/v1/payments/apply/discount
app.get("/apply/discount", applyDiscount);
// GET /api/v1/payments/coupon/all
app.get("/coupon/all", adminOnly, allCoupons);
// DELETE /api/v1/payments/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon);

export default app;

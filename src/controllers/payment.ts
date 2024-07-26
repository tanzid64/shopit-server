import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) {
    next(new ErrorHandler("Please provide amount", 400));
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  });
  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount) {
    next(new ErrorHandler("Please provide all fields", 400));
  }
  await Coupon.create({ code: coupon, amount });
  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }
  const couponData = await Coupon.findOne({ code: coupon });
  if (!couponData) {
    return next(new ErrorHandler("Invalid coupon", 400));
  }
  return res.status(200).json({
    success: true,
    discount: couponData.amount,
  });
});

export const allCoupons = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find();
  return res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    next(new ErrorHandler("Coupon not found", 404));
  }
  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon?.code} deleted successfully`,
  });
});

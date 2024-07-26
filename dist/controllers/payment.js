var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/errorHandler.js";
export const createPaymentIntent = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    if (!amount) {
        next(new ErrorHandler("Please provide amount", 400));
    }
    const paymentIntent = yield stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: { integration_check: "accept_a_payment" },
    });
    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
}));
export const newCoupon = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon, amount } = req.body;
    if (!coupon || !amount) {
        next(new ErrorHandler("Please provide all fields", 400));
    }
    yield Coupon.create({ code: coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created successfully`,
    });
}));
export const applyDiscount = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { coupon } = req.query;
    if (!coupon) {
        return next(new ErrorHandler("Coupon not found", 404));
    }
    const couponData = yield Coupon.findOne({ code: coupon });
    if (!couponData) {
        return next(new ErrorHandler("Invalid coupon", 400));
    }
    return res.status(200).json({
        success: true,
        discount: couponData.amount,
    });
}));
export const allCoupons = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield Coupon.find();
    return res.status(200).json({
        success: true,
        coupons,
    });
}));
export const deleteCoupon = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
        next(new ErrorHandler("Coupon not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: `Coupon ${coupon === null || coupon === void 0 ? void 0 : coupon.code} deleted successfully`,
    });
}));
//# sourceMappingURL=payment.js.map
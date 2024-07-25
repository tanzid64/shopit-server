import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/orderHelper.js";
import { invalidatesCache } from "../utils/revalidateCache.js";
import ErrorHandler from "../utils/errorHandler.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { orderItems, shippingInfo, user, subTotal, tax, shippingCharges, discount, total, } = req.body;
    if (!orderItems)
        return next(new ErrorHandler("Please add atleast one item", 400));
    if (!shippingInfo ||
        !user ||
        !subTotal ||
        !tax ||
        !shippingCharges ||
        !discount ||
        !total) {
        return next(new ErrorHandler("Please provide all fields", 400));
    }
    // create order
    await Order.create({
        orderItems,
        shippingInfo,
        user,
        subTotal,
        tax,
        shippingCharges,
        discount,
        total,
    });
    // reduce stock
    reduceStock(orderItems);
    invalidatesCache({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
    });
});

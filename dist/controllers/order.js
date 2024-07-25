import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/orderHelper.js";
import { invalidatesCache } from "../utils/revalidateCache.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { orderItems, shippingInfo, user, subTotal, tax, shippingCharges, discount, total, } = req.body;
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
    reduceStock(orderItems);
    invalidatesCache({ product: true, admin: true });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
    });
});

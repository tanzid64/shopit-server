var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/orderHelper.js";
import { invalidatesCache } from "../utils/revalidateCache.js";
import ErrorHandler from "../utils/errorHandler.js";
import { nodeCache } from "../app.js";
export const newOrder = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems, shippingInfo, user, subTotal, tax, shippingCharges, discount, total, } = req.body;
    if (!orderItems)
        return next(new ErrorHandler("Please add atleast one item", 400));
    if (!shippingInfo || !user || !subTotal || !tax || !total) {
        return next(new ErrorHandler("Please provide all fields", 400));
    }
    // create order
    yield Order.create({
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
    invalidatesCache({
        product: true,
        admin: true,
        userId: user,
        productId: orderItems.map((i) => i.productId.toString()),
    });
    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
    });
}));
export const myOrders = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.query.id;
    let orders;
    if (nodeCache.has(`myOrders-${user}`)) {
        orders = JSON.parse(nodeCache.get(`myOrders-${user}`));
    }
    else {
        orders = yield Order.find({ user: user }).populate("user", "name");
        nodeCache.set(`myOrders-${user}`, JSON.stringify(orders));
        //! Revalidate on New, Update, Delete Products & new order
    }
    return res.status(200).json({
        success: true,
        orders,
    });
}));
export const allOrders = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let orders;
    if (nodeCache.has("allOrders")) {
        orders = JSON.parse(nodeCache.get("allOrders"));
    }
    else {
        orders = yield Order.find();
        nodeCache.set("allOrders", JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders,
    });
}));
export const getOrderDetails = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let order;
    if (nodeCache.has(`order-${id}`)) {
        order = JSON.parse(nodeCache.get(`order-${id}`));
    }
    else {
        order = yield Order.findById(id).populate("user", "name");
        if (!order) {
            return next(new ErrorHandler("Order not found", 404));
        }
        nodeCache.set(`order-${id}`, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order,
    });
}));
export const processOrder = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const order = yield Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }
    switch (order.status) {
        case "processing":
            order.status = "out for delivery";
            break;
        case "out for delivery":
            order.status = "delivered";
            break;
        default:
            return next(new ErrorHandler("Invalid order status", 400));
    }
    yield order.save();
    invalidatesCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: order._id.toString(),
    });
    return res.status(200).json({
        success: true,
        message: "Order processed successfully",
    });
}));
export const deleteOrder = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const order = yield Order.findById(id);
    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }
    yield order.deleteOne();
    invalidatesCache({
        product: false,
        order: true,
        admin: true,
        userId: order.user,
        orderId: order._id.toString(),
    });
    return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
}));
//# sourceMappingURL=order.js.map
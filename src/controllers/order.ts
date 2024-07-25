import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { newOrderReqBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { reduceStock } from "../utils/orderHelper.js";
import { invalidatesCache } from "../utils/revalidateCache.js";
import ErrorHandler from "../utils/errorHandler.js";
import { nodeCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, newOrderReqBody>, res, next) => {
    const {
      orderItems,
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;
    if (!orderItems)
      return next(new ErrorHandler("Please add atleast one item", 400));
    if (!shippingInfo || !user || !subTotal || !tax || !total) {
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
  }
);

export const myOrders = TryCatch(async (req, res, next) => {
  const user = req.query.id;
  let orders;
  if (nodeCache.has(`myOrders-${user}`)) {
    orders = JSON.parse(nodeCache.get(`myOrders-${user}`) as string);
  } else {
    orders = await Order.find({ user: user });
    nodeCache.set(`myOrders-${user}`, JSON.stringify(orders));
    //! Revalidate on New, Update, Delete Products & new order
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  let orders;
  if (nodeCache.has("allOrders")) {
    orders = JSON.parse(nodeCache.get("allOrders") as string);
  } else {
    orders = await Order.find();
    nodeCache.set("allOrders", JSON.stringify(orders));
    //! Revalidate on New, Update, Delete Products & new order
  }
  return res.status(200).json({
    success: true,
    orders,
  });
});

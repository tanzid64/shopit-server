import { nodeCache } from "../app.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { invalidateCacheProps } from "../types/types.js";

export const invalidatesCache = async ({
  product,
  order,
  admin,
  userId,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latestProducts",
      "adminProducts",
      "categories",
    ];
    // product-{id}
    const productsId = await Product.find().select("_id");
    productsId.forEach((product) => {
      const id = product._id.toString();
      productKeys.push(`product-${id}`);
    });
    productKeys.forEach((key) => nodeCache.del(key));
  }

  if (order) {
    const orderKeys: string[] = ["allOrders", `myOrders-${userId}`];
    const orders = await Order.find().select("_id");
    orders.forEach((order) => {
      const id = order._id.toString();
      orderKeys.push(`order-${id}`);
    });
    orderKeys.forEach((key) => nodeCache.del(key));
  }
  if (admin) {
  }
};

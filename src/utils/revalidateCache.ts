import { nodeCache } from "../app.js";
import { invalidateCacheProps } from "../types/types.js";

export const invalidatesCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latestProducts",
      "adminProducts",
      "categories",
    ];
    if (typeof productId === "string") productKeys.push(`product-${productId}`);
    if (typeof productId === "object")
      productKeys.forEach((i) => `product-${i}`);
    nodeCache.del(productKeys);
  }

  if (order) {
    const orderKeys: string[] = [
      "allOrders",
      `myOrders-${userId}`,
      `order-${orderId}`,
    ];
    nodeCache.del(orderKeys);
  }
  if (admin) {
  }
};

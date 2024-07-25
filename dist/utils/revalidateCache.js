import { nodeCache } from "../app.js";
export const invalidatesCache = async ({ product, order, admin, userId, orderId, productId, }) => {
    if (product) {
        const productKeys = [
            "latestProducts",
            "adminProducts",
            "categories",
        ];
        if (typeof productId === "string")
            productKeys.push(`product-${productId}`);
        if (typeof productId === "object")
            productKeys.forEach((i) => `product-${i}`);
        nodeCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "allOrders",
            `myOrders-${userId}`,
            `order-${orderId}`,
        ];
        nodeCache.del(orderKeys);
    }
    if (admin) {
    }
};

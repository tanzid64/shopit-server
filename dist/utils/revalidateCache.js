import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
export const invalidatesCache = async ({ product, order, admin, userId, orderId }) => {
    if (product) {
        const productKeys = [
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
        const orderKeys = ["allOrders", `myOrders-${userId}`, `order-${orderId}`];
        orderKeys.forEach((key) => nodeCache.del(key));
    }
    if (admin) {
    }
};

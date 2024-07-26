import { Product } from "../models/product.js";
export const reduceStock = async (orderItems) => {
    for (const item of orderItems) {
        const product = await Product.findById(item.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        product.stock -= item.quantity;
        await product.save();
    }
};

import { Product } from "../models/product.js";
import { orderItemType } from "../types/types.js";

export const reduceStock = async (orderItems: orderItemType[]) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error("Product not found");
    }
    product.stock -= item.quantity;
    await product.save();
  }
};
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { invalidateCacheProps } from "../types/types.js";

export const invalidatesCache = async ({
  product,
  order,
  admin,
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
  }
  if (admin) {
  }
};

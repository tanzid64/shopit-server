import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  baseQuery,
  newProductRequestBody,
  searchReqQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidatesCache } from "../utils/revalidateCache.js";

export const createProduct = TryCatch(
  async (req: Request<{}, {}, newProductRequestBody>, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Product photo is required", 400));
    if (!name || !price || !stock || !category) {
      rm(photo?.path, () => {
        console.log("Photo deleted");
      });
      return next(new ErrorHandler("Please provide all fields", 400));
    }
    await Product.create({
      name,
      price,
      stock,
      category: category.toLowerCase(),
      photo: photo?.path,
    });
    // invalidate cache
    invalidatesCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const getLatestProducts = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("latestProducts")) {
    products = JSON.parse(nodeCache.get("latestProducts") as string);
  } else {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
    nodeCache.set("latestProducts", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, searchReqQuery>, res, next) => {
    const { search, price, category, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    // Query Filter
    const baseQuery: baseQuery = {};
    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) {
      baseQuery.category = category;
    }

    const [products, allProducts] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort ? { price: sort === "asc" ? 1 : -1 } : undefined)
        .limit(limit)
        .skip(skip),
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(allProducts.length / limit);
    return res.status(200).json({
      success: true,
      totalPage,
      products,
    });
  }
);

export const getAllCategories = TryCatch(async (req, res, next) => {
  let categories;
  if (nodeCache.has("categories")) {
    categories = JSON.parse(nodeCache.get("categories") as string);
  } else {
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("adminProducts")) {
    products = JSON.parse(nodeCache.get("adminProducts") as string);
  } else {
    products = await Product.find();
    nodeCache.set("adminProducts", JSON.stringify(products));
  }
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getProductDetails = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  let product;
  if (nodeCache.has(`product-${id}`)) {
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, stock, category } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  if (photo) {
    rm(product?.photo, () => {
      console.log("Old photo deleted");
    });
    product.photo = photo?.path;
  }
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category.toLowerCase();
  await product.save();
  // invalidate cache
  invalidatesCache({
    product: true,
    admin: true,
    productId: id.toString(),
  });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
  });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  rm(product?.photo, () => {
    console.log("Photo deleted");
  });
  // invalidate cache
  invalidatesCache({
    product: true,
    admin: true,
    productId: product._id.toString(),
  });
  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

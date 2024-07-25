import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createProduct, getLatestProducts, getAllCategories, getAdminProducts, getProductDetails, updateProduct, deleteProduct, getAllProducts, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// POST /api/v1/products/new
app.post("/new", adminOnly, singleUpload, createProduct);
// GET /api/v1/products/latest
app.get("/latest", getLatestProducts);
// GET /api/v1/products/all
app.get("/all", getAllProducts);
// GET /api/v1/products/categories
app.get("/categories", getAllCategories);
// GET /api/v1/products/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);
// GET /api/v1/products/:id
// PUT /api/v1/products/:id
// DELETE /api/v1/products/:id
app
    .route("/:id")
    .get(getProductDetails)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;

import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { createProduct, getLatestProducts, getAllCategories, getAdminProducts, getProductDetails, updateProduct, deleteProduct, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();
// POST /api/v1/product/new
app.post("/new", adminOnly, singleUpload, createProduct);
// GET /api/v1/product/latest
app.get("/latest", getLatestProducts);
// GET /api/v1/product/categories
app.get("/categories", getAllCategories);
// GET /api/v1/product/admin-products
app.get("/admin-products", adminOnly, getAdminProducts);
// GET /api/v1/product/:id
// PUT /api/v1/product/:id
// DELETE /api/v1/product/:id
app
    .route("/:id")
    .get(getProductDetails)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default app;

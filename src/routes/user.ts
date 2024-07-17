import express from "express";
import {
  newUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
// POST /api/v1/user/new
app.post("/new", newUser);
// GET /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);
// GET /api/v1/user/:id
app.get("/:id", getUserById);
// DELETE /api/v1/user/:id
app.delete("/:id", adminOnly, deleteUser);

export default app;

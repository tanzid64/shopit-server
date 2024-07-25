import express from "express";
import {
  newUser,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();



export default app;

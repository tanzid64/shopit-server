import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";

export const newUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, photo, gender, role } = req.body;
    await User.create({ name, email, photo, gender, role });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {}
};

import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { newUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, newUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, gender, dob, _id } = req.body;
    let user = await User.findById(_id);
    if (user) {
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}!`,
      });
    }
    if (!name || !email || !photo || !gender || !dob || !_id) {
      next(new ErrorHandler("Please provide all fields", 400));
    }
    await User.create({ name, email, photo, gender, dob: new Date(dob), _id });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  }
);

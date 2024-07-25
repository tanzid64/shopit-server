import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";
export const newUser = TryCatch(async (req, res, next) => {
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
});
export const getAllUsers = TryCatch(async (req, res, next) => {
    const users = await User.find();
    return res.status(200).json({
        success: true,
        users,
    });
});
export const getUserById = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
        success: true,
        user,
    });
});
export const deleteUser = TryCatch(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

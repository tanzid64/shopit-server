import { User } from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.js";
// Middleware to make sure only admin can access the route
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        next(new ErrorHandler("User id is required", 400));
    }
    const user = await User.findById(id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    if (user?.role !== "admin") {
        next(new ErrorHandler("Only admins can access this route", 403));
    }
    next();
});

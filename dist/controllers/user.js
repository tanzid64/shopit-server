var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../models/user.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";
export const newUser = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, photo, gender, dob, _id } = req.body;
    let user = yield User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}!`,
        });
    }
    if (!name || !email || !photo || !gender || !dob || !_id) {
        next(new ErrorHandler("Please provide all fields", 400));
    }
    yield User.create({ name, email, photo, gender, dob: new Date(dob), _id });
    return res.status(201).json({
        success: true,
        message: "User created successfully",
    });
}));
export const getAllUsers = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    return res.status(200).json({
        success: true,
        users,
    });
}));
export const getUserById = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findById(req.params.id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
        success: true,
        user,
    });
}));
export const deleteUser = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findByIdAndDelete(req.params.id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
}));
//# sourceMappingURL=user.js.map
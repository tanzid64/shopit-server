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
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "./error.js";
// Middleware to make sure only admin can access the route
export const adminOnly = TryCatch((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id) {
        next(new ErrorHandler("User id is required", 400));
    }
    const user = yield User.findById(id);
    if (!user) {
        next(new ErrorHandler("User not found", 404));
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "admin") {
        next(new ErrorHandler("Only admins can access this route", 403));
    }
    next();
}));
//# sourceMappingURL=auth.js.map
import mongoose from "mongoose";
const schema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Coupon is required"],
        unique: [true, "Coupon must be unique"],
    },
    amount: {
        type: Number,
        required: [true, "Coupon amount is required"],
    },
}, { timestamps: true });
export const Coupon = mongoose.model("Coupon", schema);
//# sourceMappingURL=coupon.js.map
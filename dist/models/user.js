import { Schema, model } from "mongoose";
import validator from "validator";
const schema = new Schema({
    _id: {
        type: String,
        required: [true, "User id is required"],
    },
    name: {
        type: String,
        required: [true, "User name is required"],
    },
    email: {
        type: String,
        unique: [true, "User email must be unique"],
        required: [true, "User email is required"],
        validate: validator.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "User photo is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "User gender is required"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    dob: {
        type: Date,
        required: [true, "User date of birth is required"],
    },
}, { timestamps: true });
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
});
export const User = model("User", schema);

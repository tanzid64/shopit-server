import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
    },
    // description: {
    //   type: String,
    //   required: [true, "Product description is required"],
    // },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
    },
    photo: {
        type: String,
        required: [true, "Product photo is required"],
    },
    stock: {
        type: Number,
        required: [true, "Product stock is required"],
    },
}, {
    timestamps: true,
});
export const Product = mongoose.model("Product", schema);

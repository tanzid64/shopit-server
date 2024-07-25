import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/", {
            dbName: "shopit",
        });
        console.log(`Database Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};

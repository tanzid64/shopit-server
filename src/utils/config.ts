import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    const conn = await mongoose.connect(uri, {
      dbName: "shopit",
    });

    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
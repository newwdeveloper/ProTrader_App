import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to mongodb successfully");
  } catch (error) {
    console.log("mongodb connection error :", error.message);
    process.exit(1);
  }
};

export default connectDB;

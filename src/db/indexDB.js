import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`MongoDB connected to: ${connectionDB.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting to MONGODB: `, error);
    process.exit(1);
  }
};

export default connectDB;

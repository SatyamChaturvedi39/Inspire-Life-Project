import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

//async function where it waits to connect to mongodb else error
export const connectDB = async () => { 
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};
import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI ?? "", {
      dbName: "pokemon",
    });

    console.log("DB Connected!");
  } catch (error) {
    console.error("DB Connection Error:", error);
    process.exit(1);
  }
}

import mongoose from "mongoose";

try {
  await mongoose.connect(process.env.MONGO_URI ?? "", {
    dbName: "pokemon",
  });

  console.log("DB Connected!");
} catch (error) {
  console.error(error);
}

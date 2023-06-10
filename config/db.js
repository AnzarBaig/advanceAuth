import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    //   useCreateIndex: true, // Updated option name to useCreateIndex
      useUnifiedTopology: true,
    //   useFindAndModify: false, // Updated option name to useFindAndModify
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default db;

import mongoose from "mongoose";

const connectDb = async () => {
    const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI;
    if (!mongoUrl) {
        const msg = "Missing Mongo connection string (set MONGODB_URL or MONGO_URI)";
        console.error(msg);
        throw new Error(msg);
    }

    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(mongoUrl);
        console.log("✅ Database Connected Successfully");
        return true;
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        throw error;
    }
}

export default connectDb

import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGODB_URL || process.env.MONGO_URI;
        if (!mongoUrl) {
            throw new Error("Missing Mongo connection string (set MONGODB_URL or MONGO_URI)");
        }

        await mongoose.connect(mongoUrl);
        console.log("DataBase Connected")
    } catch (error) {
        console.log(`DataBase Error ${error}`)
    }
}

export default connectDb
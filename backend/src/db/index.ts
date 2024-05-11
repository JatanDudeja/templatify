import mongoose from "mongoose";

const connectDB = async () => {
    const dbInstance = await mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("DB connected successfully.");
    })
    .catch((err) => {
        console.log("Error in DB connection!!", err);
    })
}


export default connectDB;
import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        const response =await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
        console.log(`MongoDB connected: ${response.connection.host}`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

export default connectDB
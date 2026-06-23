const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("CRITICAL ERROR: MONGO_URI env variable is not defined.");
            console.log("⚠️ Falling back to local JSON database mode!");
            global.isMongoConnected = false;
            return;
        }
        
        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB Atlas successfully.");
            global.isMongoConnected = true;
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error: ", err.message);
            global.isMongoConnected = false;
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("Mongoose disconnected from MongoDB.");
            global.isMongoConnected = false;
        });

        // Set a timeout of 8 seconds for the initial connection attempt
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 8000
        });
        global.isMongoConnected = true;
    } catch (error) {
        console.error("MongoDB initial connection failed:", error.message);
        console.log("⚠️ Falling back to local JSON database mode! Your tasks will be saved in backend/db_fallback.json");
        global.isMongoConnected = false;
    }
};

module.exports = connectDB;
const mongoose = require("mongoose");
const User = require("../models/userModel");

const connectToDB = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI).then(async (data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`);

        // Check if admin exists
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            // Create admin user if it doesn't exist
            await User.create({
                name: process.env.ADMIN_NAME || "Admin",
                email:
                    process.env.ADMIN_EMAIL.toLocaleLowerCase() ||
                    "admin@sneakyc.com",
                password: process.env.ADMIN_PASSWORD || "admin123",
                role: "admin",
            });
            console.log("Default Admin user created");
        }
    });
};

module.exports = connectToDB;

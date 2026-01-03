const express = require("express");
const app = express();
const error = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const origins = [process.env.ALLOWED_ORIGIN, "http://localhost:5173"];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || origins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// for sending and receiving data in json through requests;
app.use(express.json());
app.use(cookieParser());
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

// Route definitions;
app.use("/api/v1", require("./routes/productRoutes"));
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/orderRoutes"));
app.use("/api/v1", require("./routes/categoryRoutes"));
app.use("/api/v1", require("./routes/cartRoutes"));
app.use("/api/v1", require("./routes/paymentRoutes"));

// serving files statically
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

// middleware for error always should be last;
app.use(error);

module.exports = app;

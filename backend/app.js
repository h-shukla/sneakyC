const express = require("express");
const app = express();
const error = require("./middlewares/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
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
};

// for sending and receiving data in json through requests;
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Route definitions;
app.use("/api/v1", require("./routes/productRoutes"));
app.use("/api/v1", require("./routes/userRoutes"));
app.use("/api/v1", require("./routes/orderRoutes"));
app.use("/api/v1", require("./routes/categoryRoutes"));
app.use("/api/v1", require("./routes/cartRoutes"));

// file access route for images
app.get("/api/v1/uploads/:filename", (req, res) => {
    const filename = req.params.filename;

    // Validate filename to prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
        return res.status(400).json({ error: "Invalid filename" });
    }

    const filepath = path.join(__dirname, "uploads", filename);

    fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: "File not found" });
        }
        res.sendFile(filepath);
    });
});

// middleware for error always should be last;
app.use(error);

module.exports = app;

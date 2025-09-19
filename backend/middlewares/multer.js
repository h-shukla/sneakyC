const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = "./uploads/";
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Store files in a local 'uploads/' folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/"); // Files will be stored locally
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname)
        );
    },
});

// Configure Multer to accept multiple files with the field name 'images'
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return cb(
                new Error("Only jpg, jpeg, png & gif files are allowed!"),
                false
            );
        }
        cb(null, true);
    },
});

module.exports = upload;

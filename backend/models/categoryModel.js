const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter category name"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
});

module.exports = mongoose.model("Category", categorySchema);

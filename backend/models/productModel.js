const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [8, 'Price cannot exceeed 8 figures']
    },
    category: {
        type: String,
        required: [true, 'Please enter product category'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: [true, 'Please enter number of stocks'],
        maxLength: [4, 'Stock number cannot exceed 4 figures'],
        default: 1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);

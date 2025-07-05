const express = require('express');
const app = express();
const error = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// for sending and receiving data in json through requests;
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Route definitions;
app.use('/api/v1', require('./routes/productRoutes'));
app.use('/api/v1', require('./routes/userRoutes'));
app.use('/api/v1', require('./routes/orderRoutes'));

// middleware for error;
app.use(error);

module.exports = app;

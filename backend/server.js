require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// middleware to handle CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// connect to database
connectDB();

// parse requests of content-type - application/json
app.use(express.json());

//static folder for uploaded images
app.use('/backend/uploads', express.static(path.join(__dirname, 'uploads')));

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
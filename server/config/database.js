const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Temporary fallback for database URL
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/college-mart';

console.log('DATABASE_URL:', DATABASE_URL);

const dbConnect = () => {
    mongoose.connect(DATABASE_URL)
        .then(() => console.log('DB connection is successful'))
        .catch((error) => {
            console.log('Issue in DB connection');
            console.error(error);
            process.exit(1); // Optional: Exit the process if the connection fails
        });
};

module.exports = dbConnect;
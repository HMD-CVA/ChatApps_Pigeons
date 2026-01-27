const { Pool } = require('pg');
const mongoose = require('mongoose');
require('dotenv').config();


// PostgreSQL pool
const pgPool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function connectToDB() {
    let pgConnected = false;
    let mongoConnected = false;

    // Kết nối PostgreSQL
    try {
        await pgPool.query('SELECT 1');
        pgConnected = true;
    } catch (err) {
        console.error('PostgreSQL connection error:', err.message);
    }

    // Kết nối MongoDB
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        mongoConnected = true;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }

    // Kiểm tra kết quả
    if (!pgConnected) {
        throw new Error('Failed to connect to PostgreSQL.');
    }
    if (!mongoConnected) {
        throw new Error('Failed to connect to MongoDB.');
    }

    console.log('All databases connected successfully.');
}


module.exports = {
    pgPool,
    connectToDB
};
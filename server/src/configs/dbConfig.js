const sql = require('mssql');
const mongoose = require('mongoose');
require('dotenv').config();

const dbConfig = {
    user: process.env.UsernameDB,
    password: process.env.PasswordDB,
    server: process.env.SERVER_NAME, // Thay đổi nếu cần
    database: process.env.DATABASE,
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

async function connectToDB() {
    let sqlConnected = false;
    let mongoConnected = false;

    // Kết nối SQL Server
    try {
        await sql.connect(dbConfig);
        console.log('Connected to SQL Server successfully.');
        sqlConnected = true;
    } catch (err) {
        console.error('SQL Server connection error:', err.message);
    }

    // Kết nối MongoDB
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log('Connected to MongoDB successfully.');
        mongoConnected = true;
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }

    // Kiểm tra kết quả
    if (!sqlConnected) {
        throw new Error('Failed to connect to SQL Server.');
    }
    if (!mongoConnected) {
        throw new Error('Failed to connect to MongoDB.');
    }

    console.log('All databases connected successfully.');
}


module.exports = {
    sql,
    connectToDB
};
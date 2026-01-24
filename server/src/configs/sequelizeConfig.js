const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cấu hình Sequelize cho SQL Server
const sequelize = new Sequelize(
    process.env.DATABASE,      // Database name
    process.env.UsernameDB,    // Username
    process.env.PasswordDB,    // Password
    {
        host: process.env.SERVER_NAME,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: false
            }
        },
        logging: false,  // Tắt log SQL queries, set true để debug
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test connection
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✓ Sequelize connected to SQL Server successfully.');
    } catch (error) {
        console.error('✗ Sequelize connection error:', error.message);
    }
}

module.exports = { sequelize, testConnection };

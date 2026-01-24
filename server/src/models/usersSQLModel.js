const { sql } = require('../configs/dbConfig');

class UsersSQLModel {
    // Lấy tất cả users
    async getAllUsers() {
        try {
            const result = await sql.query`SELECT * FROM Users`;
            return result.recordset;
        } catch (err) {
            throw new Error('Error fetching users: ' + err.message);
        }
    }

    // Lấy user theo ID
    async getUserById(userId) {
        try {
            const result = await sql.query`SELECT * FROM Users WHERE UserId = ${userId}`;
            return result.recordset[0];
        } catch (err) {
            throw new Error('Error fetching user: ' + err.message);
        }
    }

    // Tạo user mới
    async createUser(userData) {
        try {
            const { username, email, password } = userData;
            const result = await sql.query`
                INSERT INTO Users (Username, Email, Password, CreatedAt)
                OUTPUT INSERTED.*
                VALUES (${username}, ${email}, ${password}, GETDATE())
            `;
            return result.recordset[0];
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    }

    // Cập nhật user
    async updateUser(userId, userData) {
        try {
            const { username, email } = userData;
            const result = await sql.query`
                UPDATE Users
                SET Username = ${username}, 
                    Email = ${email},
                    UpdatedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE UserId = ${userId}
            `;
            return result.recordset[0];
        } catch (err) {
            throw new Error('Error updating user: ' + err.message);
        }
    }

    // Xóa user
    async deleteUser(userId) {
        try {
            const result = await sql.query`
                DELETE FROM Users 
                OUTPUT DELETED.*
                WHERE UserId = ${userId}
            `;
            return result.recordset[0];
        } catch (err) {
            throw new Error('Error deleting user: ' + err.message);
        }
    }

    // Tìm user theo email
    async getUserByEmail(email) {
        try {
            const result = await sql.query`
                SELECT * FROM Users 
                WHERE Email = ${email}
            `;
            return result.recordset[0];
        } catch (err) {
            throw new Error('Error finding user: ' + err.message);
        }
    }

    // Sử dụng Stored Procedure
    async callStoredProcedure(procedureName, params) {
        try {
            const request = new sql.Request();
            // Thêm parameters
            Object.keys(params).forEach(key => {
                request.input(key, params[key]);
            });
            const result = await request.execute(procedureName);
            return result.recordset;
        } catch (err) {
            throw new Error('Error calling stored procedure: ' + err.message);
        }
    }

    // Query với Transaction
    async createUserWithTransaction(userData) {
        const transaction = new sql.Transaction();
        try {
            await transaction.begin();
            
            const request = new sql.Request(transaction);
            const result = await request.query`
                INSERT INTO Users (Username, Email, Password)
                VALUES (${userData.username}, ${userData.email}, ${userData.password})
            `;
            
            await transaction.commit();
            return result;
        } catch (err) {
            await transaction.rollback();
            throw new Error('Transaction failed: ' + err.message);
        }
    }
}

module.exports = new UsersSQLModel();

const usersModel = require('../models/usersModel');

class UsersService {
    // Lấy tất cả users
    async getAllUsers() {
        return await usersModel.findAll({
            where: { is_active: true }
        });
    }

    // Lấy user theo ID
    async getUserById(userId) {
        return await usersModel.findByPk(userId);
    }

    // Tạo user mới
    async createUser(userData) {
        return await usersModel.create(userData);
    }

    // Cập nhật user
    async updateUser(userId, userData) {
        const user = await usersModel.findByPk(userId);
        if (user) {
            return await user.update(userData);
        }
        return null;
    }

    // Xóa user (Soft Delete)
    async deleteUser(userId) {
        const user = await usersModel.findByPk(userId);
        if (user) {
            // Soft delete - chỉ đánh dấu is_active = false
            await user.update({ 
                is_active: false,
                updated_at: new Date()
            });
            return true;
        }
        return false;
    }
}

module.exports = new UsersService();
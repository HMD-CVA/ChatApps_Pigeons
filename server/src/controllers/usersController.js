const usersModel = require('../models/usersModel');

class UsersController {
    // GET /admin/users - Lấy tất cả users
    getAllUsers(req, res) {
        res.send('Get all users');
    }

    // GET /admin/users/:id - Lấy user theo ID
    getUserById(req, res) {
        res.send(`Get user with ID: ${req.params.id}`);
    }

    // POST /admin/users - Tạo user mới
    createUser(req, res) {
        res.send('Create new user');
    }

    // PUT /admin/users/:id - Cập nhật user
    updateUser(req, res) {
        res.send(`Update user with ID: ${req.params.id}`);
    }

    // DELETE /admin/users/:id - Xóa user
    deleteUser(req, res) {
        res.send(`Delete user with ID: ${req.params.id}`);
    }
}

module.exports = new UsersController();
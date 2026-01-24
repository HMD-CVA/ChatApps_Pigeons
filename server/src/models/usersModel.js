const mongoose = require('mongoose');

// Định nghĩa schema
const userSchema = new mongoose.Schema({
    // Tên field: { các thuộc tính }
    username: {
        type: String,        // Kiểu dữ liệu
        required: true,      // Bắt buộc phải có
        unique: true,        // Giá trị duy nhất
        trim: true          // Loại bỏ khoảng trắng
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],  // Custom error message
        unique: true,
        lowercase: true,     // Tự động chuyển thành chữ thường
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']  // Validation regex
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        min: 0,
        max: 120,
        default: 18          // Giá trị mặc định
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],  // Chỉ chấp nhận các giá trị này
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    avatar: String,          // Cách viết ngắn gọn
    
    // Array
    hobbies: [String],
    
    // Object lồng nhau
    address: {
        street: String,
        city: String,
        zipCode: String
    },
    
    // Reference đến collection khác
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {
    timestamps: true  // Tự động thêm createdAt và updatedAt
});

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
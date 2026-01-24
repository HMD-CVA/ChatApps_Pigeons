const { DataTypes } = require('sequelize');
const { sequelize } = require('../configs/sequelizeConfig');

// Định nghĩa model User với Sequelize
const User = sequelize.define('User', {
    // Primary Key
    UserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'UserId'
    },
    
    // Username
    Username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50]  // Độ dài từ 3-50 ký tự
        }
    },
    
    // Email
    Email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true  // Validate email format
        }
    },
    
    // Password
    Password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    
    // IsActive
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    
    // CreatedAt
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'CreatedAt'
    },
    
    // UpdatedAt
    UpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'UpdatedAt'
    }
}, {
    // Cấu hình bảng
    tableName: 'Users',        // Tên bảng trong database
    timestamps: false,         // Tắt auto createdAt/updatedAt của Sequelize
    freezeTableName: true      // Không tự động thêm 's' vào tên bảng
});

// Instance methods
User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.Password;  // Không trả về password
    return values;
};

// Class methods
User.findByEmail = async function(email) {
    return await this.findOne({ where: { Email: email } });
};

module.exports = User;

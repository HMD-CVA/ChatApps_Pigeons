const messagesModel = require('../models/messagesModel');

class MessagesService {
    // Lấy tất cả messages
    async getAllMessages() {
        return await messagesModel.findAll({
            where: { is_deleted: false }
        });
    }

    // Lấy message theo ID
    async getMessageById(messageId) {
        return await messagesModel.findByPk(messageId);
    }

    // Tạo message mới
    async createMessage(messageData) {
        return await messagesModel.create(messageData);
    }

    // Cập nhật message
    async updateMessage(messageId, messageData) {
        const message = await messagesModel.findByPk(messageId);
        if (message) {
            return await message.update(messageData);
        }
        return null;
    }

    // Xóa message (Soft Delete)
    async deleteMessage(messageId) {
        const message = await messagesModel.findByPk(messageId);
        if (message) {
            // Soft delete - chỉ đánh dấu is_deleted = true
            await message.update({ 
                is_deleted: true,
                updated_at: new Date()
            });
            return true;
        }
        return false;
    }
}

module.exports = new MessagesService();
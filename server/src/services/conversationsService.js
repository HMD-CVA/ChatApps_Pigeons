const conversationsModel = require('../models/conversationsModel'); 

class ConversationsService {
    // Lấy tất cả conversations
    async getAllConversations() {
        return await conversationsModel.findAll({
            where: { is_active: true }
        });
    }

    // Lấy conversation theo ID
    async getConversationById(conversationId) {
        return await conversationsModel.findByPk(conversationId);
    }

    // Tạo conversation mới
    async createConversation(conversationData) {
        return await conversationsModel.create(conversationData);
    }

    // Cập nhật conversation
    async updateConversation(conversationId, conversationData) {
        const conversation = await conversationsModel.findByPk(conversationId);
        if (conversation) {
            return await conversation.update(conversationData);
        }
        return null;
    }

    // Xóa conversation (Soft Delete)
    async deleteConversation(conversationId) {
        const conversation = await conversationsModel.findByPk(conversationId);
        if (conversation) {
            // Soft delete - chỉ đánh dấu is_active = false
            await conversation.update({ 
                is_active: false,
                updated_at: new Date()
            });
            return true;
        }
        return false;
    }
}

module.exports = new ConversationsService();
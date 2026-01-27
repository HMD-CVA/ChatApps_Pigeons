const usersService = require('./usersService');
const participantsService = require('./participantsService');
const messagesService = require('./messagesService');
const conversationsService = require('./conversationsService');

class HomeService {
    // Lấy tất cả messages của 1 user theo userId
    async getMessagesByUser(userId) {
        // Giả sử bạn có hàm getAllMessages trong messagesService
        return await messagesService.getAllMessages({ sender_id: userId });
    }

    // Lấy tất cả participant record của 1 user
    async getParticipantsByUser(userId) {
        // Giả sử bạn có hàm getAllParticipants trong participantsService
        return await participantsService.getAllParticipants({ user_id: userId });
    }

    // Lấy tất cả messages trong 1 conversation
    async getMessagesByConversation(conversationId) {
        return await messagesService.getAllMessages({ conversation_id: conversationId });
    }

    // Tổng hợp: lấy tất cả messages của user trong các conversation mà user là participant
    async getAllUserMessagesInJoinedConversations(userId) {
        // Lấy tất cả participant record của user
        const participants = await participantsService.getAllParticipants({ user_id: userId });
        const conversationIds = participants.map(p => p.conversation_id);
        // Lấy tất cả messages trong các conversation này
        if (conversationIds.length === 0) return [];
        return await messagesService.getAllMessages({ conversation_id: conversationIds });
    }
}

module.exports = new HomeService();

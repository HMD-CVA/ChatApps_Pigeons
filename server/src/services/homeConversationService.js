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

    // Lấy danh sách conversations của user để hiển thị sidebar
    async getAllUserMessagesInJoinedConversations(userId) {
        // 1. Lấy tất cả participant record của user
        const userParticipants = await participantsService.getAllParticipants({ user_id: userId });
        const conversationIds = userParticipants.map(p => p.conversation_id);
        if (conversationIds.length === 0) return [];

        // 2. Lấy thông tin các conversation
        const conversations = await conversationsService.getAllConversations({ id: conversationIds });

        // 3. Lấy participants cho các conversation này
        const allParticipants = await participantsService.getAllParticipants({ conversation_id: conversationIds });

        // 4. Lấy user info cho tất cả participants
        const userIds = [...new Set(allParticipants.map(p => p.user_id))];
        const users = await usersService.getAllUsers({ id: userIds });

        console.log('Conversation', conversations);

        // 5. Lấy last message cho mỗi conversation
        const lastMessages = {};
        for (const convId of conversationIds) {
            const msgs = await messagesService.getAllMessages({ conversation_id: convId, limit: 1, order: [['created_at', 'DESC']] });
            lastMessages[convId] = msgs && msgs.length > 0 ? msgs[0] : null;
        }

        // console.log('Last Messages:', lastMessages);

        // 6. Tổng hợp dữ liệu cho sidebar
        return conversations.map(conv => {
            const convParticipants = allParticipants.filter(p => p.conversation_id === conv.id)
                .map(p => {
                    const u = users.find(u => u.id === p.user_id);
                    return u ? { user_id: u.id, full_name: u.full_name, avatar_url: u.avatar_url } : { user_id: p.user_id };
                });
            // Xác định tiêu đề hội thoại
            let title = conv.name;
            if (!title) {
                // Nếu là chat 1-1, lấy tên user còn lại (không phải userId hiện tại)
                const other = convParticipants.find(u => u.user_id !== userId);
                title = other ? other.full_name : 'Cuộc trò chuyện';
            }
            return {
                conversation_id: conv.id,
                title,
                type: conv.conversation_type,
                participants: convParticipants,
                lastMessage: lastMessages[conv.id]
            };
        });
    }
}

module.exports = new HomeService();

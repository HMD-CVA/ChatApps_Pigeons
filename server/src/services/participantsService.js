const participantsModel = require('../models/participantsModel');

class ParticipantsService {
    // Lấy tất cả participants
    async getAllParticipants() {
        return await participantsModel.findAll();
    }

    // Lấy participant theo ID
    async getParticipantById(participantId) {
        return await participantsModel.findByPk(participantId);
    }

    // Tạo participant mới
    async createParticipant(participantData) {
        return await participantsModel.create(participantData);
    }

    // Cập nhật participant
    async updateParticipant(participantId, participantData) {
        const participant = await participantsModel.findByPk(participantId);
        if (participant) {
            return await participant.update(participantData);
        }
        return null;
    }

    // Xóa participant (Soft Delete)
    async deleteParticipant(participantId) {
        const participant = await participantsModel.findByPk(participantId);
        if (participant) {
            // Soft delete - chỉ đánh dấu is_active = false
            await participant.update({ 
                is_active: false,
                updated_at: new Date()
            });
            return true;
        }
        return false;
    }
}

module.exports = new ParticipantsService();
const homeService = require('../services/homeConversationService');
const SuccessResponse = require('../core/successResponse');

class HomeController {
    // GET /:id - Lấy dữ liệu home cho user
    async getHome(req, res) {
        const homeData = await homeService.getAllUserMessagesInJoinedConversations(req.params.id);
        new SuccessResponse({
            message: 'Get home data successfully',
            metadata: {
                homeData: homeData,
            }
        }).send(res);
    }
}

module.exports = new HomeController();
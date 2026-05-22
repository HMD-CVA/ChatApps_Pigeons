require('dotenv').config();
const {
    openAI: { modelAI, openRouterApiKey },
    app: { frontendUrl },
} = require('../configs/index.js');

const OpenAI = require('openai');

const MODERATION_PROMPT = `Bạn là một hệ thống kiểm duyệt nội dung cho mạng xã hội.
Phân tích nội dung bên dưới và CHỈ trả về đúng một JSON object hợp lệ, không có Markdown, không có giải thích thêm, không thêm ký tự nào khác.

Mẫu đầu ra bắt buộc:
{
    "category": "clean",
    "score": 0.05,
    "reason": "Nội dung an toàn"
}

Quy ước:
- category chỉ được dùng một trong các giá trị: "hate_speech", "violence", "spam", "adult_content", "toxic_language", "clean"
- score là số từ 0 đến 1, với 0 là an toàn và 1 là nguy hiểm
- reason là mô tả ngắn gọn, rõ ràng, bằng tiếng Việt

Tiêu chí kiểm duyệt:
- hate_speech: Khích động thù hận, phân biệt đối xử hoặc bạo lực
- violence: Nội dung bạo lực, đe dọa
- spam: Quảng cáo lặp lại, liên kết độc hại
- adult_content: Nội dung 18+ không phù hợp
- toxic_language: Chứa từ ngữ thô tục, chửi bậy, xúc phạm người khác (Chấm điểm từ 0.5 - 0.7)
- clean: Nội dung bình thường, an toàn

Nội dung cần kiểm duyệt:
`;

function normalizeModerationResult(result = {}) {
        const category = typeof result.category === 'string' && result.category.trim()
                ? result.category.trim()
                : 'unknown';
        const score = Number(result.score);
        const normalizedScore = Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : 0;
        const reason = typeof result.reason === 'string' ? result.reason.trim() : '';
        const isViolated =
                typeof result.isViolated === 'boolean'
                        ? result.isViolated
                        : category !== 'clean' && normalizedScore >= 0.5;

        return {
                isViolated,
                category,
                score: normalizedScore,
                reason,
        };
}

class ModerationService {
    #openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: openRouterApiKey,
        defaultHeaders: {
            'HTTP-Referer': frontendUrl,
            'X-OpenRouter-Title': 'Chat Pigeons',
        },
    });

    async moderateText(text) {
        try {
            if (!text || typeof text !== 'string') {
                return {
                    isViolated: false,
                    category: 'clean',
                    score: 0,
                    reason: 'Nội dung trống'
                };
            }

            const completion = await this.#openai.chat.completions.create({
                model: modelAI,
                messages: [
                    {
                        role: 'user',
                        content: MODERATION_PROMPT + JSON.stringify(text)
                    }
                ],
                max_tokens: 256,
                temperature: 0.3
            });

            const responseText = completion.choices[0]?.message?.content || '';

            // Parse JSON từ response, chấp nhận cả nội dung có bọc ```json
            const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return normalizeModerationResult(result);
            }

            // Fallback nếu parse JSON thất bại
            console.warn('[Moderation] Could not parse JSON from response:', responseText);
            return normalizeModerationResult({
                category: 'unknown',
                score: 0.5,
                reason: 'Không thể phân tích',
            });
        } catch (error) {
            console.error('[Moderation] Error moderating text:', error.message);
            // Return safe default on error
            return normalizeModerationResult({
                category: 'error',
                score: 0,
                reason: 'Lỗi hệ thống, bỏ qua kiểm duyệt',
            });
        }
    }
}

module.exports = new ModerationService();

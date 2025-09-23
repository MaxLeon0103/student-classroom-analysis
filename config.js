// AI配置模块
module.exports = {
    // OpenAI配置
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
        maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
        baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1", // 支持第三方API提供商
    },

    // 自定义提示词配置
    prompts: {
        // 系统角色提示词
        systemPrompt: process.env.SYSTEM_PROMPT || "你是一名专业的教育评价专家，擅长为学生提供详细、建设性的课堂表现评价。",
        
        // 主要提示词模板
        mainPrompt: process.env.MAIN_PROMPT || `作为一名专业的教育评价专家，请根据以下课堂内容和评价等级，生成一份具体、详细的学生课堂表现评价：

课堂内容：{content}
评价等级：{rating}

评价要求：
1. **必须紧密结合课程内容**：分析学生对本节课具体知识点的掌握情况
2. **具体化评价**：基于课堂中的具体表现、回答、互动等实际情况进行评价
3. **知识点导向**：明确指出学生在哪些知识点上表现良好，哪些需要加强
4. **实例支撑**：如果可能，引用学生在课堂中的具体表现作为评价依据

评价结构：
- 开头：简要总结学生在本节课的整体表现
- 主体：详细分析学生对具体知识点的掌握情况
  * 重点知识理解程度
  * 课堂互动参与情况
  * 问题回答质量
  * 学习态度表现
- 结尾：基于本节课内容给出具体的改进建议

语言要求：
- 专业且具体，避免空泛的套话
- 紧密结合课程内容，体现专业性
- 字数控制在250-350字之间
- 语调积极正面，鼓励学生进步

请直接输出评价内容，不要包含标题或格式标记。`,

        // 不同评价等级的自定义提示词
        ratingPrompts: {
            '优秀': process.env.EXCELLENT_PROMPT || "该学生在本节课表现优秀，请重点分析其对具体知识点的掌握情况，突出其在课堂中的优秀表现（如准确回答问题、积极参与讨论、创新思维等），并基于本节课内容给出进一步提升的具体建议。",
            '良好': process.env.GOOD_PROMPT || "该学生在本节课表现良好，请分析其对课程知识点的掌握情况，平衡地评价其优点（如基本理解、适度参与等）和需要改进的地方，并基于本节课的具体内容给出针对性的改进建议。",
            '一般': process.env.AVERAGE_PROMPT || "该学生在本节课表现一般，请具体分析其在课程知识点掌握上的不足之处，指出其在课堂互动、问题回答等方面的具体问题，并基于本节课内容给出具体的改进建议和鼓励。",
            '待改进': process.env.POOR_PROMPT || "该学生在本节课需要改进，请温和地分析其在课程知识点理解上的具体问题，指出其在课堂参与、学习态度等方面的不足，并基于本节课内容给出详细的改进方案和鼓励。"
        }
    },

    // 其他AI服务配置（备用选项）
    alternativeAPIs: {
        // 百度文心一言
        baidu: {
            apiKey: process.env.BAIDU_API_KEY,
            secretKey: process.env.BAIDU_SECRET_KEY,
            endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions",
            model: "ernie-bot-turbo"
        },
        
        // 阿里通义千问
        alibaba: {
            apiKey: process.env.ALIBABA_API_KEY,
            endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
            model: "qwen-turbo"
        },
        
        // 腾讯混元
        tencent: {
            apiKey: process.env.TENCENT_API_KEY,
            endpoint: "https://hunyuan.tencentcloudapi.com/",
            model: "hunyuan-lite"
        }
    },

    // 评价生成配置
    evaluation: {
        minContentLength: parseInt(process.env.MIN_CONTENT_LENGTH) || 10,
        maxContentLength: parseInt(process.env.MAX_CONTENT_LENGTH) || 500,
        defaultWordCount: parseInt(process.env.DEFAULT_WORD_COUNT) || 250,
        enableCustomRating: process.env.ENABLE_CUSTOM_RATING === 'true'
    }
};

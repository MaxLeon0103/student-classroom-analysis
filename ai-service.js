// AI服务模块 - 支持多种AI API
const config = require('./config');

class AIService {
    constructor() {
        this.currentProvider = process.env.AI_PROVIDER || 'openai';
    }

    // 生成评价的主要方法
    async generateEvaluation(content, rating) {
        try {
            switch (this.currentProvider) {
                case 'openai':
                    return await this.generateWithOpenAI(content, rating);
                case 'baidu':
                    return await this.generateWithBaidu(content, rating);
                case 'alibaba':
                    return await this.generateWithAlibaba(content, rating);
                case 'tencent':
                    return await this.generateWithTencent(content, rating);
                default:
                    throw new Error(`不支持的AI提供商: ${this.currentProvider}`);
            }
        } catch (error) {
            console.error('AI服务调用失败:', error);
            throw error;
        }
    }

    // OpenAI服务
    async generateWithOpenAI(content, rating) {
        const OpenAI = require('openai');
        
        const openai = new OpenAI({
            apiKey: config.openai.apiKey,
            baseURL: config.openai.baseURL, // 支持第三方API提供商
        });

        const prompt = this.buildPrompt(content, rating);

        const completion = await openai.chat.completions.create({
            model: config.openai.model,
            messages: [
                {
                    role: "system",
                    content: config.prompts.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: config.openai.maxTokens,
            temperature: config.openai.temperature,
        });

        return completion.choices[0].message.content;
    }

    // 百度文心一言服务
    async generateWithBaidu(content, rating) {
        const axios = require('axios');
        
        const prompt = this.buildPrompt(content, rating);
        
        const response = await axios.post(config.alternativeAPIs.baidu.endpoint, {
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: config.openai.temperature,
            max_output_tokens: config.openai.maxTokens
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.alternativeAPIs.baidu.apiKey}`
            }
        });

        return response.data.result;
    }

    // 阿里通义千问服务
    async generateWithAlibaba(content, rating) {
        const axios = require('axios');
        
        const prompt = this.buildPrompt(content, rating);
        
        const response = await axios.post(config.alternativeAPIs.alibaba.endpoint, {
            model: config.alternativeAPIs.alibaba.model,
            input: {
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },
            parameters: {
                temperature: config.openai.temperature,
                max_tokens: config.openai.maxTokens
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.alternativeAPIs.alibaba.apiKey}`
            }
        });

        return response.data.output.text;
    }

    // 腾讯混元服务
    async generateWithTencent(content, rating) {
        const axios = require('axios');
        
        const prompt = this.buildPrompt(content, rating);
        
        const response = await axios.post(config.alternativeAPIs.tencent.endpoint, {
            model: config.alternativeAPIs.tencent.model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: config.openai.temperature,
            max_tokens: config.openai.maxTokens
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.alternativeAPIs.tencent.apiKey}`
            }
        });

        return response.data.choices[0].message.content;
    }

    // 构建提示词
    buildPrompt(content, rating) {
        let prompt = config.prompts.mainPrompt;
        
        // 替换占位符
        prompt = prompt.replace('{content}', content);
        prompt = prompt.replace('{rating}', rating);
        
        // 添加特定评价等级的提示词
        if (config.prompts.ratingPrompts[rating]) {
            prompt += `\n\n特别说明：${config.prompts.ratingPrompts[rating]}`;
        }
        
        return prompt;
    }

    // 切换AI提供商
    setProvider(provider) {
        if (['openai', 'baidu', 'alibaba', 'tencent'].includes(provider)) {
            this.currentProvider = provider;
            console.log(`AI提供商已切换到: ${provider}`);
        } else {
            throw new Error(`不支持的AI提供商: ${provider}`);
        }
    }

    // 获取当前提供商
    getCurrentProvider() {
        return this.currentProvider;
    }

    // 获取支持的提供商列表
    getSupportedProviders() {
        return ['openai', 'baidu', 'alibaba', 'tencent'];
    }
}

module.exports = new AIService();

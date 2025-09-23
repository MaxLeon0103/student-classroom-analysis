const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// 导入配置和AI服务
const config = require('./config');
const aiService = require('./ai-service');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// AI评价生成API
app.post('/api/generate-evaluation', async (req, res) => {
    try {
        const { content, rating } = req.body;
        
        // 验证输入
        if (!content || !content.trim()) {
            return res.status(400).json({ 
                error: '课堂内容不能为空' 
            });
        }
        
        if (!rating) {
            return res.status(400).json({ 
                error: '请选择评价等级' 
            });
        }

        // 调用AI生成评价
        const evaluation = await aiService.generateEvaluation(content, rating);
        
        res.json({ 
            success: true, 
            evaluation: evaluation 
        });
        
    } catch (error) {
        console.error('生成评价时出错:', error);
        res.status(500).json({ 
            error: '生成评价时出现错误，请稍后重试' 
        });
    }
});

// 添加新的API路由
app.get('/api/config', (req, res) => {
    res.json({
        currentProvider: aiService.getCurrentProvider(),
        supportedProviders: aiService.getSupportedProviders(),
        evaluationConfig: config.evaluation
    });
});

// 切换AI提供商
app.post('/api/switch-provider', (req, res) => {
    try {
        const { provider } = req.body;
        aiService.setProvider(provider);
        res.json({ 
            success: true, 
            message: `AI提供商已切换到: ${provider}`,
            currentProvider: aiService.getCurrentProvider()
        });
    } catch (error) {
        res.status(400).json({ 
            error: error.message 
        });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('请确保已配置OPENAI_API_KEY环境变量');
});


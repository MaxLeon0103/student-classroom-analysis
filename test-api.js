#!/usr/bin/env node

// API连接测试脚本
require('dotenv').config();
const config = require('./config');
const aiService = require('./ai-service');

console.log('🔍 测试第三方OpenAI API连接');
console.log('=====================================\n');

// 显示配置信息
console.log('📋 当前配置:');
console.log(`API提供商: ${config.openai.baseURL}`);
console.log(`模型: ${config.openai.model}`);
console.log(`API Key: ${config.openai.apiKey.substring(0, 10)}...`);
console.log(`最大Token: ${config.openai.maxTokens}`);
console.log(`温度参数: ${config.openai.temperature}\n`);

// 测试API连接
async function testAPI() {
    try {
        console.log('🚀 正在测试API连接...');
        
        const testContent = `本节课学习了数学中的二次函数，包括：
1. 二次函数的定义和一般形式 y=ax²+bx+c
2. 二次函数的图像特征（开口方向、顶点、对称轴）
3. 二次函数与一元二次方程的关系
4. 实际应用问题（如抛物线运动、最值问题等）

学生在课堂中表现积极，能够回答关于二次函数开口方向的问题，但在计算顶点坐标时出现了一些错误。`;

        const testRating = '良好';
        
        const result = await aiService.generateEvaluation(testContent, testRating);
        
        console.log('✅ API连接成功！');
        console.log('\n📝 生成的评价示例:');
        console.log('=' .repeat(50));
        console.log(result);
        console.log('=' .repeat(50));
        
        // 分析评价质量
        analyzeEvaluation(result, testContent);
        
    } catch (error) {
        console.log('❌ API连接失败:');
        console.log(`错误信息: ${error.message}`);
        
        if (error.message.includes('401')) {
            console.log('\n💡 可能的解决方案:');
            console.log('1. 检查API Key是否正确');
            console.log('2. 确认API Key是否有足够的配额');
            console.log('3. 验证第三方API提供商是否正常工作');
        } else if (error.message.includes('403')) {
            console.log('\n💡 可能的解决方案:');
            console.log('1. 检查API Key权限');
            console.log('2. 确认模型访问权限');
        } else if (error.message.includes('429')) {
            console.log('\n💡 可能的解决方案:');
            console.log('1. 请求频率过高，请稍后重试');
            console.log('2. 检查API配额是否充足');
        }
    }
}

// 分析评价质量
function analyzeEvaluation(evaluation, originalContent) {
    console.log('\n🔍 评价质量分析:');
    
    const contentKeywords = extractKeywords(originalContent);
    const evaluationKeywords = extractKeywords(evaluation);
    
    // 检查是否包含课程相关内容
    const relevantKeywords = contentKeywords.filter(keyword => 
        evaluationKeywords.some(evalKeyword => 
            evalKeyword.includes(keyword) || keyword.includes(evalKeyword)
        )
    );
    
    const relevanceScore = (relevantKeywords.length / contentKeywords.length * 100).toFixed(1);
    
    console.log(`课程内容关键词: ${contentKeywords.join(', ')}`);
    console.log(`评价相关性得分: ${relevanceScore}%`);
    
    if (relevanceScore >= 70) {
        console.log('✅ 评价与课程内容高度相关');
    } else if (relevanceScore >= 50) {
        console.log('⚠️  评价与课程内容相关性一般');
    } else {
        console.log('❌ 评价与课程内容相关性较低');
    }
    
    // 检查评价长度
    const wordCount = evaluation.length;
    console.log(`评价字数: ${wordCount}字`);
    
    if (wordCount >= 200 && wordCount <= 400) {
        console.log('✅ 评价长度适中');
    } else {
        console.log('⚠️  评价长度可能需要调整');
    }
    
    // 检查是否包含具体建议
    const hasSuggestions = evaluation.includes('建议') || evaluation.includes('改进') || evaluation.includes('加强');
    console.log(`包含改进建议: ${hasSuggestions ? '✅' : '❌'}`);
}

// 提取关键词
function extractKeywords(text) {
    const keywords = [];
    
    // 数学相关关键词
    const mathKeywords = ['二次函数', '顶点', '对称轴', '开口', '抛物线', '方程', '最值'];
    mathKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
            keywords.push(keyword);
        }
    });
    
    // 学习相关关键词
    const learningKeywords = ['理解', '掌握', '应用', '计算', '分析', '问题', '回答'];
    learningKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
            keywords.push(keyword);
        }
    });
    
    return [...new Set(keywords)]; // 去重
}

// 运行测试
testAPI().then(() => {
    console.log('\n🎉 测试完成！');
    process.exit(0);
}).catch(error => {
    console.error('\n💥 测试过程中发生错误:', error);
    process.exit(1);
});

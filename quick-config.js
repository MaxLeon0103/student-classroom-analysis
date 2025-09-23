#!/usr/bin/env node

// 快速配置脚本
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🎓 学生课堂分析系统 - 快速配置向导');
console.log('=====================================\n');

// 检查是否存在.env文件
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log('✅ 已创建 .env 配置文件\n');
    } else {
        console.log('❌ 未找到 env.example 文件');
        process.exit(1);
    }
}

// 配置选项
const configOptions = [
    {
        key: 'AI_PROVIDER',
        question: '请选择AI服务提供商 (openai/baidu/alibaba/tencent): ',
        default: 'openai',
        options: ['openai', 'baidu', 'alibaba', 'tencent']
    },
    {
        key: 'OPENAI_API_KEY',
        question: '请输入OpenAI API Key (可选，如果选择其他提供商): ',
        default: '',
        required: false
    },
    {
        key: 'OPENAI_MODEL',
        question: '请选择OpenAI模型 (gpt-3.5-turbo/gpt-4/gpt-4-turbo): ',
        default: 'gpt-3.5-turbo',
        options: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
    },
    {
        key: 'PORT',
        question: '请输入服务器端口 (默认3000): ',
        default: '3000'
    }
];

let currentIndex = 0;
let config = {};

// 读取现有配置
function loadExistingConfig() {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        lines.forEach(line => {
            if (line.trim() && !line.startsWith('#')) {
                const [key, value] = line.split('=');
                if (key && value) {
                    config[key.trim()] = value.trim();
                }
            }
        });
    } catch (error) {
        console.log('⚠️  无法读取现有配置，将使用默认值\n');
    }
}

// 保存配置
function saveConfig() {
    try {
        const envContent = fs.readFileSync(envPath, 'utf8');
        let newContent = envContent;
        
        Object.keys(config).forEach(key => {
            const regex = new RegExp(`^${key}=.*$`, 'm');
            const newLine = `${key}=${config[key]}`;
            
            if (regex.test(newContent)) {
                newContent = newContent.replace(regex, newLine);
            } else {
                newContent += `\n${newLine}`;
            }
        });
        
        fs.writeFileSync(envPath, newContent);
        console.log('\n✅ 配置已保存到 .env 文件');
    } catch (error) {
        console.log('\n❌ 保存配置失败:', error.message);
    }
}

// 询问配置
function askConfig() {
    if (currentIndex >= configOptions.length) {
        saveConfig();
        console.log('\n🎉 配置完成！');
        console.log('\n📋 下一步：');
        console.log('1. 运行 npm install 安装依赖');
        console.log('2. 运行 npm start 启动服务器');
        console.log('3. 访问 http://localhost:' + config.PORT);
        console.log('4. 访问 http://localhost:' + config.PORT + '/admin.html 进行高级配置');
        rl.close();
        return;
    }
    
    const option = configOptions[currentIndex];
    let question = option.question;
    
    if (option.default) {
        question += `[${option.default}] `;
    }
    
    rl.question(question, (answer) => {
        let value = answer.trim();
        
        // 使用默认值
        if (!value && option.default) {
            value = option.default;
        }
        
        // 验证选项
        if (option.options && !option.options.includes(value)) {
            console.log(`❌ 无效选项，请选择: ${option.options.join(', ')}`);
            askConfig();
            return;
        }
        
        // 验证必填项
        if (option.required !== false && !value) {
            console.log('❌ 此项为必填项');
            askConfig();
            return;
        }
        
        config[option.key] = value;
        currentIndex++;
        
        // 如果选择了非OpenAI提供商，跳过OpenAI相关配置
        if (option.key === 'AI_PROVIDER' && value !== 'openai') {
            // 跳过OpenAI API Key和模型配置
            currentIndex += 2;
        }
        
        askConfig();
    });
}

// 显示当前配置
function showCurrentConfig() {
    console.log('📋 当前配置:');
    Object.keys(config).forEach(key => {
        if (key.includes('KEY') || key.includes('SECRET')) {
            console.log(`   ${key}: ${'*'.repeat(8)}`);
        } else {
            console.log(`   ${key}: ${config[key]}`);
        }
    });
    console.log('');
}

// 主函数
function main() {
    loadExistingConfig();
    showCurrentConfig();
    
    rl.question('是否要重新配置？(y/N): ', (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            config = {}; // 清空现有配置
            currentIndex = 0;
            askConfig();
        } else {
            console.log('✅ 使用现有配置');
            console.log('\n📋 下一步：');
            console.log('1. 运行 npm install 安装依赖');
            console.log('2. 运行 npm start 启动服务器');
            console.log('3. 访问 http://localhost:' + (config.PORT || '3000'));
            rl.close();
        }
    });
}

main();

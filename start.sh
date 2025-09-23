#!/bin/bash

echo "========================================"
echo "    学生课堂分析系统启动脚本"
echo "========================================"
echo

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "错误: 未检测到Node.js，请先安装Node.js"
    echo "下载地址: https://nodejs.org/"
    exit 1
fi

echo "检测到Node.js版本:"
node --version

# 检查是否存在package.json
if [ ! -f "package.json" ]; then
    echo "错误: 未找到package.json文件"
    echo "请确保在正确的项目目录中运行此脚本"
    exit 1
fi

# 检查是否存在node_modules
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "错误: 依赖安装失败"
        exit 1
    fi
    echo "依赖安装完成！"
    echo
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "警告: 未找到.env文件"
    echo "正在复制env.example为.env..."
    cp env.example .env
    echo
    echo "请编辑.env文件，填入你的OpenAI API密钥"
    echo "然后重新运行此脚本"
    exit 1
fi

echo "正在启动服务器..."
echo "服务器地址: http://localhost:3000"
echo "按Ctrl+C停止服务器"
echo

npm start


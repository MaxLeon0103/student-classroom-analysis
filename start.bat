@echo off
echo ========================================
echo    学生课堂分析系统启动脚本
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 检测到Node.js版本:
node --version

REM 检查是否存在package.json
if not exist "package.json" (
    echo 错误: 未找到package.json文件
    echo 请确保在正确的项目目录中运行此脚本
    pause
    exit /b 1
)

REM 检查是否存在node_modules
if not exist "node_modules" (
    echo 正在安装依赖包...
    npm install
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
    echo 依赖安装完成！
    echo.
)

REM 检查环境变量文件
if not exist ".env" (
    echo 警告: 未找到.env文件
    echo 正在复制env.example为.env...
    copy env.example .env
    echo.
    echo 请编辑.env文件，填入你的OpenAI API密钥
    echo 然后重新运行此脚本
    pause
    exit /b 1
)

echo 正在启动服务器...
echo 服务器地址: http://localhost:3000
echo 按Ctrl+C停止服务器
echo.

npm start


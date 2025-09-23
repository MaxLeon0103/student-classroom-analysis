# 学生课堂分析系统

一个基于AI的智能学生课堂表现评价系统，能够根据教师输入的课堂内容和选择的评价等级，自动生成专业、详细的学生评价报告。

## 功能特点

- 🎯 **智能评价生成**：基于OpenAI GPT模型，生成专业的教育评价
- 📝 **直观的界面设计**：现代化的用户界面，操作简单直观
- ⭐ **多等级评价**：支持优秀、良好、一般、待改进四个评价等级
- 🔄 **实时验证**：输入验证和实时反馈
- 📋 **一键复制**：生成的评价可一键复制使用
- 💾 **自动保存**：支持草稿自动保存和恢复
- 📱 **响应式设计**：支持桌面和移动设备

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- 响应式设计
- Font Awesome 图标库

### 后端
- Node.js + Express.js
- OpenAI API 集成
- CORS 支持

## 安装和运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd student-classroom-analysis
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `env.example` 文件为 `.env` 并填入你的配置：

```bash
cp env.example .env
```

编辑 `.env` 文件：
```env
# OpenAI API配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# 服务器配置
PORT=3000
NODE_ENV=development
```

### 4. 启动服务器
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 5. 访问应用
打开浏览器访问：http://localhost:3000

## 使用说明

1. **输入课堂内容**：在文本框中详细描述学生在课堂上的表现
2. **选择评价等级**：点击相应的评价等级按钮（优秀、良好、一般、待改进）
3. **生成评价**：点击"生成评价"按钮，系统将调用AI生成专业评价
4. **查看结果**：生成的评价将显示在右侧区域
5. **复制使用**：点击"复制"按钮可复制评价内容

## API接口

### POST /api/generate-evaluation

生成学生评价的API接口。

**请求参数：**
```json
{
  "content": "课堂内容描述",
  "rating": "评价等级"
}
```

**响应：**
```json
{
  "success": true,
  "evaluation": "生成的评价内容"
}
```

## 项目结构

```
student-classroom-analysis/
├── public/                 # 前端文件
│   ├── index.html         # 主页面
│   ├── styles.css         # 样式文件
│   └── script.js          # 前端逻辑
├── server.js              # 后端服务器
├── package.json           # 项目配置
├── env.example            # 环境变量示例
└── README.md              # 项目说明
```

## 注意事项

1. **API密钥安全**：请妥善保管你的OpenAI API密钥，不要将其提交到版本控制系统
2. **网络连接**：确保服务器能够访问OpenAI API
3. **字符限制**：课堂内容输入限制为500字符
4. **浏览器兼容性**：建议使用现代浏览器（Chrome、Firefox、Safari、Edge）

## 故障排除

### 常见问题

1. **API调用失败**
   - 检查OpenAI API密钥是否正确
   - 确认网络连接正常
   - 检查API配额是否充足

2. **页面无法加载**
   - 确认服务器已启动
   - 检查端口是否被占用
   - 查看控制台错误信息

3. **评价生成失败**
   - 检查输入内容是否为空
   - 确认已选择评价等级
   - 查看网络请求状态

## 开发计划

- [ ] 添加用户认证系统
- [ ] 支持评价历史记录
- [ ] 添加更多评价维度
- [ ] 支持批量评价生成
- [ ] 添加数据导出功能

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。


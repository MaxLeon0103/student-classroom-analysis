// DOM元素
const contentTextarea = document.getElementById('classroom-content');
const charCount = document.getElementById('char-count');
const ratingInputs = document.querySelectorAll('input[name="rating"]');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const resultDate = document.getElementById('result-date');
const resultRating = document.getElementById('result-rating');
const copyBtn = document.getElementById('copy-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');
const successToast = document.getElementById('success-toast');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateGenerateButton();
});

// 事件监听器
function initializeEventListeners() {
    // 内容输入监听
    contentTextarea.addEventListener('input', function() {
        updateCharCount();
        updateGenerateButton();
    });

    // 评价等级选择监听
    ratingInputs.forEach(input => {
        input.addEventListener('change', updateGenerateButton);
    });

    // 生成按钮点击
    generateBtn.addEventListener('click', generateEvaluation);

    // 复制按钮点击
    copyBtn.addEventListener('click', copyResult);
}

// 更新字符计数
function updateCharCount() {
    const content = contentTextarea.value;
    const count = content.length;
    charCount.textContent = count;
    
    // 字符数限制提示
    if (count > 500) {
        charCount.style.color = '#dc3545';
        contentTextarea.value = content.substring(0, 500);
        charCount.textContent = '500';
    } else if (count > 400) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#999';
    }
}

// 更新生成按钮状态
function updateGenerateButton() {
    const hasContent = contentTextarea.value.trim().length > 0;
    const hasRating = Array.from(ratingInputs).some(input => input.checked);
    
    generateBtn.disabled = !(hasContent && hasRating);
}

// 生成评价
async function generateEvaluation() {
    const content = contentTextarea.value.trim();
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    
    // 验证输入
    if (!content) {
        showError('请输入课堂内容');
        return;
    }
    
    if (!selectedRating) {
        showError('请选择评价等级');
        return;
    }

    // 显示加载状态
    showLoading(true);
    
    try {
        const response = await fetch('/api/generate-evaluation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                rating: selectedRating.value
            })
        });

        const data = await response.json();

        if (response.ok) {
            // 显示结果
            displayResult(data.evaluation, selectedRating.value);
            showSuccess();
        } else {
            showError(data.error || '生成评价时出现错误');
        }
    } catch (error) {
        console.error('请求失败:', error);
        showError('网络错误，请检查连接后重试');
    } finally {
        showLoading(false);
    }
}

// 显示结果
function displayResult(evaluation, rating) {
    resultText.textContent = evaluation;
    resultRating.textContent = rating;
    resultDate.textContent = new Date().toLocaleString('zh-CN');
    resultContainer.style.display = 'block';
    
    // 滚动到结果区域
    resultContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// 复制结果
async function copyResult() {
    try {
        await navigator.clipboard.writeText(resultText.textContent);
        
        // 临时改变按钮文本
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '#28a745';
        }, 2000);
        
    } catch (error) {
        console.error('复制失败:', error);
        showError('复制失败，请手动复制');
    }
}

// 显示加载状态
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
    generateBtn.disabled = show;
}

// 显示错误消息
function showError(message) {
    errorMessage.textContent = message;
    errorToast.style.display = 'flex';
    
    setTimeout(() => {
        errorToast.style.display = 'none';
    }, 5000);
}

// 显示成功消息
function showSuccess() {
    successToast.style.display = 'flex';
    
    setTimeout(() => {
        successToast.style.display = 'none';
    }, 3000);
}

// 键盘快捷键
document.addEventListener('keydown', function(event) {
    // Ctrl+Enter 或 Cmd+Enter 生成评价
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        if (!generateBtn.disabled) {
            generateEvaluation();
        }
    }
});

// 自动保存功能（可选）
function autoSave() {
    const content = contentTextarea.value;
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    
    if (content || selectedRating) {
        const data = {
            content: content,
            rating: selectedRating ? selectedRating.value : null,
            timestamp: Date.now()
        };
        localStorage.setItem('classroom-analysis-draft', JSON.stringify(data));
    }
}

// 恢复草稿
function restoreDraft() {
    const saved = localStorage.getItem('classroom-analysis-draft');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // 检查草稿是否过期（24小时）
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                if (data.content) {
                    contentTextarea.value = data.content;
                    updateCharCount();
                }
                
                if (data.rating) {
                    const ratingInput = document.querySelector(`input[value="${data.rating}"]`);
                    if (ratingInput) {
                        ratingInput.checked = true;
                    }
                }
                
                updateGenerateButton();
            } else {
                localStorage.removeItem('classroom-analysis-draft');
            }
        } catch (error) {
            console.error('恢复草稿失败:', error);
            localStorage.removeItem('classroom-analysis-draft');
        }
    }
}

// 页面加载时恢复草稿
document.addEventListener('DOMContentLoaded', restoreDraft);

// 定期自动保存
setInterval(autoSave, 30000); // 每30秒保存一次

// 页面卸载时保存
window.addEventListener('beforeunload', autoSave);


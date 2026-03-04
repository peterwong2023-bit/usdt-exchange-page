// 配置
const EXCHANGE_RATE = 7.20;
const FEE_USDT = 1.50;
const MIN_AMOUNT = 10;

// 计算兑换金额
function calculateExchange() {
    const usdtInput = document.getElementById('usdtInput');
    const cnyInput = document.getElementById('cnyInput');
    const usdtAmount = parseFloat(usdtInput.value) || 0;
    
    if (usdtAmount > 0) {
        const cnyAmount = (usdtAmount * EXCHANGE_RATE).toFixed(2);
        cnyInput.value = cnyAmount;
        
        // 更新汇率信息
        document.getElementById('exchangeAmount').textContent = usdtAmount.toFixed(2);
        document.getElementById('feeAmount').textContent = FEE_USDT.toFixed(2);
        document.getElementById('totalAmount').textContent = (usdtAmount + FEE_USDT).toFixed(2);
    } else {
        cnyInput.value = '';
        document.getElementById('exchangeAmount').textContent = '0.00';
        document.getElementById('feeAmount').textContent = '0.00';
        document.getElementById('totalAmount').textContent = '0.00';
    }
}

// 显示Toast提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 验证金额
function validateAmount() {
    const usdtAmount = parseFloat(document.getElementById('usdtInput').value) || 0;
    
    if (usdtAmount < MIN_AMOUNT) {
        showToast(`充值金额不能低于 ${MIN_AMOUNT} USDT`, 'error');
        return false;
    }
    
    return true;
}

// 生成二维码
function generateQRCode(canvas, size = 240) {
    const ctx = canvas.getContext('2d');
    canvas.width = size;
    canvas.height = size;
    
    // 绘制白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // 绘制二维码图案
    ctx.fillStyle = '#000000';
    const blockSize = size / 30;
    for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
            if (Math.random() > 0.5) {
                ctx.fillRect(i * blockSize, j * blockSize, blockSize, blockSize);
            }
        }
    }
}

// 显示支付页面
function showPaymentPage() {
    if (!validateAmount()) return;
    
    const usdtAmount = parseFloat(document.getElementById('usdtInput').value);
    const cnyAmount = document.getElementById('cnyInput').value;
    const totalAmount = usdtAmount + FEE_USDT;
    
    // 更新支付页面信息
    document.getElementById('paymentUsdt').textContent = usdtAmount.toFixed(2);
    document.getElementById('paymentCny').textContent = cnyAmount;
    document.getElementById('transferAmount').textContent = totalAmount.toFixed(2);
    
    // 生成支付二维码
    const qrCanvas = document.getElementById('paymentQrcode');
    generateQRCode(qrCanvas);
    
    // 显示支付页面
    document.getElementById('paymentPage').classList.add('active');
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

// 关闭支付页面
function closePaymentPage() {
    document.getElementById('paymentPage').classList.remove('active');
}

// 复制钱包地址
function copyWalletAddress() {
    const address = document.getElementById('walletAddressText').textContent;
    
    // 创建临时文本框
    const tempInput = document.createElement('input');
    tempInput.value = address;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('地址已复制', 'success');
}

// 显示退款通知
function showRefundNotification(reason, orderNumber, amount, txHash) {
    // 设置问题原因
    const reasonElement = document.getElementById('refundReason');
    if (Array.isArray(reason)) {
        reasonElement.innerHTML = '<ul>' + reason.map(r => `<li>${r}</li>`).join('') + '</ul>';
    } else {
        reasonElement.textContent = reason;
    }
    
    // 设置订单信息
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('refundAmount').textContent = amount;
    document.getElementById('txHash').textContent = txHash;
    
    // 显示弹窗
    document.getElementById('refundModal').classList.add('active');
}

// 关闭退款通知
function closeRefundNotification() {
    document.getElementById('refundModal').classList.remove('active');
}

// 联系客服
function contactCustomerService() {
    showToast('正在为您转接客服...', 'success');
    // 这里可以添加实际的客服联系逻辑
    setTimeout(() => {
        closeRefundNotification();
    }, 2000);
}

// 跳转到退款页面
function goToRefundPage() {
    window.location.href = 'refund.html';
}

// 模拟检测充值问题（示例函数，用于测试）
function simulateRefundScenario() {
    const scenario = {
        reason: [
            'KYC风险检测：您的充值资金存在风险因素',
            '系统已自动隔离该笔资金以保障平台安全',
            '您可以申请退款，审核通过后将退回至指定地址'
        ],
        orderNumber: 'ORD' + Date.now(),
        amount: '50.00 USDT',
        txHash: '0x' + Math.random().toString(16).substr(2, 64)
    };
    
    showRefundNotification(scenario.reason, scenario.orderNumber, scenario.amount, scenario.txHash);
}

// 显示交易中状态卡片
function showTradingStatus(amount, countdown) {
    const tradingStatus = document.getElementById('tradingStatus');
    if (tradingStatus) {
        const amountElement = tradingStatus.querySelector('.status-amount strong');
        const countdownElement = tradingStatus.querySelector('.countdown');
        
        if (amountElement) amountElement.textContent = amount;
        if (countdownElement) countdownElement.textContent = countdown;
        
        tradingStatus.style.display = 'flex';
    }
}

// 隐藏交易中状态卡片
function hideTradingStatus() {
    const tradingStatus = document.getElementById('tradingStatus');
    if (tradingStatus) {
        tradingStatus.style.display = 'none';
    }
}

// 显示退款中状态卡片
function showRefundStatus(amount) {
    const refundStatus = document.getElementById('refundStatus');
    if (refundStatus) {
        const amountElement = refundStatus.querySelector('.status-amount strong');
        
        if (amountElement) amountElement.textContent = amount;
        
        refundStatus.style.display = 'flex';
    }
}

// 隐藏退款中状态卡片
function hideRefundStatus() {
    const refundStatus = document.getElementById('refundStatus');
    if (refundStatus) {
        refundStatus.style.display = 'none';
    }
}

// 检查并显示进行中的状态
function checkPendingStatus() {
    // 这里可以从localStorage或服务器获取状态信息
    // 示例：检查是否有退款中的订单
    const hasRefundInProgress = localStorage.getItem('refundInProgress');
    if (hasRefundInProgress) {
        const refundData = JSON.parse(hasRefundInProgress);
        showRefundStatus(refundData.amount);
    }
    
    // 示例：检查是否有交易中的订单
    const hasTradingInProgress = localStorage.getItem('tradingInProgress');
    if (hasTradingInProgress) {
        const tradingData = JSON.parse(hasTradingInProgress);
        showTradingStatus(tradingData.amount, tradingData.countdown);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定主页面事件
    const usdtInput = document.getElementById('usdtInput');
    const buyBtn = document.getElementById('buyBtn');
    if (usdtInput) usdtInput.addEventListener('input', calculateExchange);
    if (buyBtn) buyBtn.addEventListener('click', showPaymentPage);
    
    // 绑定支付页面事件
    const backBtn = document.getElementById('backBtn');
    const copyAddressBtn = document.getElementById('copyAddressBtn');
    if (backBtn) backBtn.addEventListener('click', closePaymentPage);
    if (copyAddressBtn) copyAddressBtn.addEventListener('click', copyWalletAddress);
    
    // 绑定退款通知事件
    const applyRefundBtn = document.getElementById('applyRefundBtn');
    const contactBtn = document.getElementById('contactBtn');
    const closeRefundBtn = document.getElementById('closeRefundBtn');
    if (applyRefundBtn) applyRefundBtn.addEventListener('click', goToRefundPage);
    if (contactBtn) contactBtn.addEventListener('click', contactCustomerService);
    if (closeRefundBtn) closeRefundBtn.addEventListener('click', closeRefundNotification);
    
    // 绑定测试按钮
    const testRefundBtn = document.getElementById('testRefundBtn');
    if (testRefundBtn) testRefundBtn.addEventListener('click', simulateRefundScenario);
    
    // 检查并显示进行中的状态
    checkPendingStatus();
    
    // 示例：演示如何显示退款中状态（可以删除此行）
    // showRefundStatus('50.00 USDT');
    
    // 示例：演示如何显示交易中状态（可以删除此行）
    // showTradingStatus('300', '00:09:53');
});

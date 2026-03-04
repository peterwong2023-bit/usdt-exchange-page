// 显示Toast提示
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 验证退款地址
function validateRefundAddress() {
    const refundAddress = document.getElementById('refundAddress').value.trim();
    
    if (!refundAddress) {
        showToast('请输入退款地址', 'error');
        return false;
    }
    
    // 验证USDT地址格式（TRC20地址以T开头，长度为34个字符）
    if (!refundAddress.startsWith('T') || refundAddress.length !== 34) {
        showToast('请输入正确的USDT-TRC20地址', 'error');
        return false;
    }
    
    return true;
}

// 显示确认弹窗
function showConfirmModal() {
    if (!validateRefundAddress()) return;
    
    const refundAmount = document.getElementById('displayAmount').textContent;
    const refundAddress = document.getElementById('refundAddress').value.trim();
    
    document.getElementById('confirmAmount').textContent = refundAmount;
    document.getElementById('confirmAddress').textContent = refundAddress;
    
    document.getElementById('confirmModal').classList.add('active');
}

// 关闭确认弹窗
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

// 处理退款
function processRefund() {
    closeConfirmModal();
    
    showToast('正在处理退款...', 'success');
    
    // 模拟退款处理
    setTimeout(() => {
        // 生成退款交易号
        const txId = 'TX' + Date.now();
        document.getElementById('applicationId').textContent = txId;
        
        // 显示成功弹窗
        document.getElementById('successModal').classList.add('active');
    }, 2000);
}

// 关闭成功弹窗并返回
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    
    // 返回主页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定提交按钮
    document.getElementById('submitRefund').addEventListener('click', showConfirmModal);
    
    // 绑定确认弹窗按钮
    document.getElementById('cancelSubmit').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmSubmit').addEventListener('click', processRefund);
    
    // 绑定成功弹窗按钮
    document.getElementById('doneBtn').addEventListener('click', closeSuccessModal);
    
    // 点击遮罩层关闭弹窗
    document.querySelector('.confirm-modal .modal-overlay').addEventListener('click', closeConfirmModal);
});

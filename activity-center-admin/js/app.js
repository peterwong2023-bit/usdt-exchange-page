/**
 * 活动中心管理后台 - JavaScript 交互
 */

// ===== DOM Elements =====
const sidebar = document.getElementById('sidebar');
const notificationBar = document.getElementById('notificationBar');
const toastContainer = document.getElementById('toastContainer');
const searchInput = document.getElementById('searchInput');
const selectAllCheckbox = document.getElementById('selectAll');
const themeIcon = document.getElementById('themeIcon');

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNotificationBar();
    initSidebar();
    initSearch();
    initCheckboxes();
    initTableSort();
    initAnimations();
    initKeyboardShortcuts();
});

// ===== Theme Management =====
function initTheme() {
    // 从 localStorage 获取主题设置，默认跟随系统
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    // 添加过渡类
    document.documentElement.classList.add('theme-transition');
    
    // 设置主题
    document.documentElement.setAttribute('data-theme', theme);
    
    // 更新图标
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }
    
    // 保存到 localStorage
    localStorage.setItem('theme', theme);
    
    // 移除过渡类
    setTimeout(() => {
        document.documentElement.classList.remove('theme-transition');
    }, 300);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`, 'info');
}

// ===== Language Switcher =====
function toggleLangMenu() {
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function switchLang(lang) {
    const langNames = {
        'zh': '中文',
        'en': 'English',
        'vi': 'Tiếng Việt'
    };
    
    // 更新显示的语言代码
    const langCodeEl = document.querySelector('.lang-code');
    if (langCodeEl) {
        langCodeEl.textContent = langNames[lang];
    }
    
    // 更新选中状态
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 关闭下拉菜单
    toggleLangMenu();
    
    // 保存语言偏好
    localStorage.setItem('preferredLang', lang);
    
    showToast(`已切换到 ${langNames[lang]}`, 'info');
}

// 点击外部关闭语言下拉菜单
document.addEventListener('click', function(e) {
    const langSwitcher = document.querySelector('.lang-switcher');
    const dropdown = document.getElementById('langDropdown');
    if (langSwitcher && dropdown && !langSwitcher.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ===== Notification Bar =====
function initNotificationBar() {
    // 检查是否之前已关闭
    const isClosed = sessionStorage.getItem('notificationClosed') === 'true';
    if (isClosed && notificationBar) {
        notificationBar.classList.add('hidden');
        document.querySelector('.app-container').style.paddingTop = '0';
        document.querySelector('.sidebar').style.top = '0';
        document.querySelector('.top-header').style.top = '0';
    }
}

function closeNotification() {
    if (notificationBar) {
        notificationBar.classList.add('hidden');
        
        // 记住关闭状态
        sessionStorage.setItem('notificationClosed', 'true');
        
        // 调整布局
        setTimeout(() => {
            document.querySelector('.app-container').style.paddingTop = '0';
            document.querySelector('.sidebar').style.top = '0';
            document.querySelector('.top-header').style.top = '0';
        }, 300);
    }
}

// ===== Sidebar =====
function initSidebar() {
    // 从 localStorage 恢复侧边栏状态
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
    }
    
    // 导航项点击效果
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // 移除所有活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加当前活动状态
            item.classList.add('active');
            
            // 添加点击波纹效果
            createRipple(e, item);
        });
    });
    
    // 点击外部关闭侧边栏（移动端）
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !e.target.closest('.menu-toggle')) {
                    sidebar.classList.remove('open');
                }
            }
        }
    });
}

function toggleSidebar() {
    if (!sidebar) return;
    
    if (window.innerWidth <= 1024) {
        // 移动端：切换 open 状态
        sidebar.classList.toggle('open');
    } else {
        // 桌面端：切换 collapsed 状态
        sidebar.classList.toggle('collapsed');
        // 保存状态到 localStorage
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    }
}

// ===== Search =====
function initSearch() {
    if (searchInput) {
        // 搜索防抖
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
        
        // 回车搜索
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(searchTimeout);
                performSearch(e.target.value);
            }
        });
    }
    
    // 搜索按钮点击
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            if (searchInput) {
                performSearch(searchInput.value);
            }
        });
    }
}

function performSearch(query) {
    const rows = document.querySelectorAll('.data-table tbody tr');
    const searchTerm = query.toLowerCase().trim();
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const isMatch = searchTerm === '' || text.includes(searchTerm);
        
        row.style.display = isMatch ? '' : 'none';
        if (isMatch) visibleCount++;
    });
    
    // 更新分页信息
    updateTableInfo(visibleCount, rows.length);
    
    if (searchTerm && visibleCount === 0) {
        showToast('未找到匹配的结果', 'warning');
    }
}

function updateTableInfo(visible, total) {
    const tableInfo = document.querySelector('.table-info span');
    if (tableInfo) {
        tableInfo.textContent = `显示 1-${visible} 共 ${total} 条`;
    }
}

// ===== Checkboxes =====
function initCheckboxes() {
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.data-table tbody .checkbox');
            checkboxes.forEach(cb => {
                cb.checked = e.target.checked;
            });
            
            updateBulkActions();
        });
    }
    
    // 单个复选框变化
    const rowCheckboxes = document.querySelectorAll('.data-table tbody .checkbox');
    rowCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateSelectAllState();
            updateBulkActions();
        });
    });
}

function updateSelectAllState() {
    const checkboxes = document.querySelectorAll('.data-table tbody .checkbox');
    const checkedCount = document.querySelectorAll('.data-table tbody .checkbox:checked').length;
    
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = checkedCount === checkboxes.length && checkboxes.length > 0;
        selectAllCheckbox.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
    }
}

function updateBulkActions() {
    const checkedCount = document.querySelectorAll('.data-table tbody .checkbox:checked').length;
    
    if (checkedCount > 0) {
        showToast(`已选择 ${checkedCount} 个平台`, 'info', 1500);
    }
}

// ===== Table Sort =====
function initTableSort() {
    const headers = document.querySelectorAll('.data-table th');
    
    headers.forEach((header, index) => {
        // 跳过复选框和操作列
        if (index === 0 || index === headers.length - 1) return;
        
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const isAscending = header.classList.contains('sort-asc');
            
            // 重置所有排序状态
            headers.forEach(h => {
                h.classList.remove('sort-asc', 'sort-desc');
            });
            
            // 设置当前排序状态
            header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
            
            // 执行排序
            sortTable(index, !isAscending);
        });
    });
}

function sortTable(columnIndex, ascending) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex]?.textContent.trim() || '';
        const bValue = b.children[columnIndex]?.textContent.trim() || '';
        
        // 尝试日期排序
        const aDate = parseDate(aValue);
        const bDate = parseDate(bValue);
        if (aDate && bDate) {
            return ascending ? aDate - bDate : bDate - aDate;
        }
        
        // 尝试数字排序
        const aNum = parseFloat(aValue.replace(/[^\d.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^\d.-]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return ascending ? aNum - bNum : bNum - aNum;
        }
        
        // 字符串排序
        return ascending 
            ? aValue.localeCompare(bValue, 'zh-CN')
            : bValue.localeCompare(aValue, 'zh-CN');
    });
    
    // 重新添加行
    rows.forEach(row => tbody.appendChild(row));
    
    // 重新应用动画
    rows.forEach((row, index) => {
        row.style.animation = 'none';
        row.offsetHeight; // 触发重排
        row.style.animation = `fadeIn 0.3s ease ${index * 0.03}s backwards`;
    });
}

function parseDate(dateStr) {
    // 解析 DD/MM/YYYY 格式
    const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (match) {
        return new Date(match[3], match[2] - 1, match[1]);
    }
    return null;
}

// ===== Animations =====
function initAnimations() {
    // 观察元素进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    // 观察统计卡片
    document.querySelectorAll('.stat-card').forEach(card => {
        observer.observe(card);
    });
    
    // 表格行交错动画
    const tableRows = document.querySelectorAll('.data-table tbody tr');
    tableRows.forEach((row, index) => {
        row.style.animation = `fadeIn 0.3s ease ${index * 0.05}s backwards`;
    });
}

// ===== Keyboard Shortcuts =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
        }
        
        // Escape: 关闭侧边栏（移动端）
        if (e.key === 'Escape') {
            if (sidebar?.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
        
        // Ctrl/Cmd + B: 切换侧边栏
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Ctrl/Cmd + D: 切换主题
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }
    });
}

// ===== Copy to Clipboard =====
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('已复制到剪贴板', 'success');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showToast('已复制到剪贴板', 'success');
    } catch (err) {
        showToast('复制失败，请手动复制', 'error');
    }
    
    document.body.removeChild(textarea);
}

// ===== Toast Notifications =====
function showToast(message, type = 'info', duration = 3000) {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== Ripple Effect =====
function createRipple(event, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// ===== Add Dynamic Styles =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes toastOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(dynamicStyles);

// ===== Utility Functions =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== Modal Functions =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 先移动到 body 末尾，确保 z-index 有效且不被父级裁剪
        document.body.appendChild(modal);
        
        // 移除旧的内联样式
        modal.removeAttribute('style');
        
        // 激活弹窗
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // 聚焦第一个输入框
        setTimeout(() => {
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput && !firstInput.readonly) firstInput.focus();
        }, 300);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        // 重置样式
        modal.style.display = '';
        modal.style.visibility = '';
        modal.style.opacity = '';
        document.body.style.overflow = '';
        
        // 重置表单
        const form = modal.querySelector('form');
        if (form) form.reset();
    }
}

function submitCreatePlatform() {
    const form = document.getElementById('createPlatformForm');
    const inputs = form.querySelectorAll('input[required]');
    let valid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = 'var(--danger-color)';
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
    });
    
    if (!valid) {
        showToast('请填写必填项', 'warning');
        return;
    }
    
    // 模拟保存成功
    showToast('平台创建成功', 'success');
    closeModal('createPlatformModal');
}

// 点击遮罩关闭弹窗
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modalId = e.target.id;
        closeModal(modalId);
    }
});

// ESC 键关闭弹窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// 全局监听平台编辑按钮点击
document.addEventListener('click', (e) => {
    const item = e.target.closest('.btn-platform-edit');
    if (item) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Platform edit clicked:', item.dataset);
        const { name, slug, id } = item.dataset;
        if (name && slug && id) {
            handleEditPlatform(name, slug, id);
        }
    }
});

// ===== Dropdown Functions =====
function toggleDropdown(button) {
    if (event) event.stopPropagation();
    const dropdown = button.closest('.dropdown');
    if (!dropdown) return;
    const isActive = dropdown.classList.contains('active');
    
    // 关闭所有其他下拉菜单
    document.querySelectorAll('.dropdown.active').forEach(d => {
        d.classList.remove('active');
    });
    
    // 切换当前下拉菜单
    if (!isActive) {
        dropdown.classList.add('active');
    }
}

// 点击其他地方关闭下拉菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.active').forEach(d => {
            d.classList.remove('active');
        });
    }
});


// ===== Edit Platform Functions =====
function handleEditPlatform(name, slug, id) {
    // 更新弹窗内容
    const nameEl = document.getElementById('editPlatformName');
    const idEl = document.getElementById('editPlatformId');
    const displayEl = document.getElementById('editPlatformDisplayName');
    const slugEl = document.getElementById('editPlatformSlug');

    if (nameEl) nameEl.textContent = name;
    if (idEl) idEl.value = id;
    if (displayEl) displayEl.value = name;
    if (slugEl) slugEl.value = slug;
    
    // 关闭下拉菜单
    document.querySelectorAll('.dropdown.active').forEach(d => {
        d.classList.remove('active');
    });
    
    // 打开弹窗
    console.log('Opening modal...');
    openModal('newEditPlatformModal');
}

function saveEditPlatform() {
    showToast('平台信息已保存', 'success');
    closeModal('newEditPlatformModal');
}

function confirmDeletePlatform() {
    if (confirm('确定要删除此平台吗？此操作不可撤销。')) {
        showToast('平台已删除', 'success');
        closeModal('newEditPlatformModal');
    }
}

function closeTab(element) {
    if (element) {
        const tab = element.closest('.admin-tab');
        if (tab) {
            if (tab.classList.contains('active')) {
                location.href = 'index.html';
            } else {
                tab.style.display = 'none';
            }
        }
    }
}

function closeAllTabs() {
    if (confirm('确定要关闭所有标签页吗？这将会返回到首页。')) {
        location.href = 'index.html';
    }
}

// ===== Export Functions =====
window.closeTab = closeTab;
window.closeAllTabs = closeAllTabs;
window.closeNotification = closeNotification;
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.submitCreatePlatform = submitCreatePlatform;
window.toggleDropdown = toggleDropdown;
window.handleEditPlatform = handleEditPlatform;
window.saveEditPlatform = saveEditPlatform;
window.confirmDeletePlatform = confirmDeletePlatform;
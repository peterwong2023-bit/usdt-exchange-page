# 🚀 部署说明

## 快速访问

系统已启动在本地服务器，可以直接访问：

### 🎯 推荐入口（版本选择页）
```
http://localhost:8000/start.html
```
这是一个精美的版本选择页面，可以快速了解两个版本的区别并选择合适的版本。

### 📌 直接访问

**V1 基础版**:
```
http://localhost:8000/index.html
```

**V2 运营优化版** (推荐):
```
http://localhost:8000/index-v2.html
```

---

## 📂 项目文件清单

### HTML 文件
- `start.html` (11K) - 版本选择启动页
- `index.html` (13K) - V1 基础版主页
- `index-v2.html` (26K) - V2 运营版主页

### CSS 样式文件
- `styles.css` (17K) - V1 样式
- `styles-v2.css` (26K) - V2 增强样式

### JavaScript 文件
- `data.js` (10K) - V1 数据
- `data-v2.js` (14K) - V2 增强数据
- `app.js` (29K) - V1 应用逻辑
- `app-v2.js` (24K) - V2 应用逻辑

### 文档文件
- `README.md` (7.3K) - 项目总说明
- `VERSION_COMPARISON.md` (7.9K) - 版本详细对比
- `OPERATOR_GUIDE.md` (9.0K) - 运营人员使用指南
- `DEPLOYMENT.md` - 本文件

**总计**: 12个文件，约 200KB

---

## 🎯 推荐使用流程

### 第一次使用

1. **访问版本选择页**
   ```
   http://localhost:8000/start.html
   ```

2. **了解两个版本的区别**
   - 查看功能对比
   - 了解适用场景
   - 阅读特性介绍

3. **选择合适的版本**
   - 小团队/基础需求 → V1 基础版
   - 专业团队/高效运营 → V2 运营版（推荐）

4. **阅读使用指南**
   ```
   http://localhost:8000/OPERATOR_GUIDE.md
   ```

5. **开始使用**

### 日常使用

**如果已经确定使用 V2 版本（推荐）**:
```
直接访问: http://localhost:8000/index-v2.html
收藏/添加书签以便快速访问
```

---

## 🌐 生产环境部署

### 方案1: Nginx 部署

1. **复制文件到Web根目录**
   ```bash
   sudo cp -r risk-monitoring-system/ /var/www/html/risk-control/
   ```

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name risk-control.yourdomain.com;
       
       root /var/www/html/risk-control;
       index start.html;
       
       location / {
           try_files $uri $uri/ =404;
       }
       
       # 启用gzip压缩
       gzip on;
       gzip_types text/css application/javascript text/html;
   }
   ```

3. **重启 Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

### 方案2: Apache 部署

1. **复制文件**
   ```bash
   sudo cp -r risk-monitoring-system/ /var/www/html/risk-control/
   ```

2. **配置 .htaccess**
   ```apache
   <IfModule mod_rewrite.c>
       RewriteEngine On
       DirectoryIndex start.html
   </IfModule>
   
   # 启用压缩
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css application/javascript
   </IfModule>
   ```

### 方案3: Docker 部署

1. **创建 Dockerfile**
   ```dockerfile
   FROM nginx:alpine
   COPY risk-monitoring-system/ /usr/share/nginx/html/
   EXPOSE 80
   ```

2. **构建镜像**
   ```bash
   docker build -t risk-monitoring-system .
   ```

3. **运行容器**
   ```bash
   docker run -d -p 80:80 --name risk-control risk-monitoring-system
   ```

### 方案4: CDN 部署

**推荐用于静态文件加速**

1. 将所有文件上传到对象存储（如阿里云 OSS、腾讯云 COS）
2. 配置 CDN 加速域名
3. 设置缓存策略：
   - HTML: 不缓存或短时缓存（5分钟）
   - CSS/JS: 长期缓存（30天）
   - 启用 Gzip 压缩

---

## 🔧 生产环境配置建议

### 1. 连接真实API

修改 `data-v2.js` 或 `app-v2.js`，将模拟数据替换为真实API调用：

```javascript
// 替换前（模拟数据）
const urgentAlerts = [...];

// 替换后（真实API）
async function loadUrgentAlerts() {
    const response = await fetch('/api/v1/risk/alerts?level=critical');
    return await response.json();
}
```

### 2. 配置API基础路径

在 `app-v2.js` 顶部添加配置：

```javascript
const API_BASE_URL = 'https://api.yourdomain.com/risk-control';
const API_VERSION = 'v1';
const API_TIMEOUT = 30000; // 30秒超时
```

### 3. 添加身份验证

```javascript
// 在每个API请求中添加认证头
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json'
};
```

### 4. 错误处理

```javascript
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('数据加载失败，请稍后重试', 'error');
        return null;
    }
}
```

### 5. 配置WebSocket实时推送

```javascript
const ws = new WebSocket('wss://api.yourdomain.com/ws/risk-alerts');

ws.onmessage = function(event) {
    const alert = JSON.parse(event.data);
    // 实时显示新告警
    addNewAlert(alert);
    showToast(`新告警: ${alert.title}`, 'warning');
};
```

---

## 🔒 安全配置

### 1. HTTPS 部署

**强烈建议生产环境使用 HTTPS**

```bash
# 使用 Let's Encrypt 免费证书
sudo certbot --nginx -d risk-control.yourdomain.com
```

### 2. 访问控制

```nginx
# Nginx 配置 IP 白名单
location / {
    allow 192.168.1.0/24;  # 公司内网
    allow 10.0.0.0/8;      # VPN网段
    deny all;
}
```

### 3. CORS 配置

如果前后端分离部署：

```javascript
// 后端 API 需要配置 CORS
Access-Control-Allow-Origin: https://risk-control.yourdomain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

### 4. CSP 配置

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;">
```

---

## 📊 性能优化

### 1. 启用 Gzip 压缩

Nginx 配置:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/css application/javascript text/html application/json;
```

### 2. 设置缓存策略

```nginx
location ~* \.(js|css)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
    expires 5m;
    add_header Cache-Control "no-cache";
}
```

### 3. 使用 CDN 加速静态资源

将 Chart.js 和 ECharts 等大型库使用 CDN 引用：

```html
<!-- 已在 index-v2.html 中使用 CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
```

### 4. 图片优化

如果添加了图片资源，建议：
- 使用 WebP 格式
- 压缩图片大小
- 使用图片 CDN

---

## 📱 移动端适配

系统已经内置响应式设计，支持：
- ✅ 手机端（< 768px）
- ✅ 平板端（768px - 1024px）
- ✅ 桌面端（> 1024px）

**移动端访问建议**:
- 使用 V2 版本（更好的移动端优化）
- 横屏使用获得最佳体验
- 建议使用 Chrome 或 Safari 浏览器

---

## 🔍 监控和日志

### 1. 前端错误监控

建议集成 Sentry 或其他错误监控服务：

```javascript
// 全局错误捕获
window.addEventListener('error', function(event) {
    console.error('Global Error:', event.error);
    // 发送到监控平台
    sendErrorToMonitoring(event.error);
});
```

### 2. 性能监控

```javascript
// 使用 Performance API
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page Load Time:', pageLoadTime + 'ms');
});
```

### 3. 用户行为分析

集成 Google Analytics 或其他分析工具：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

---

## 🧪 测试

### 浏览器兼容性测试

**推荐浏览器**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**不支持**:
- ❌ IE 11 及以下

### 功能测试清单

- [ ] 页面正常加载
- [ ] 数据正确显示
- [ ] 过滤功能正常
- [ ] 批量操作可用
- [ ] 图表正常渲染
- [ ] 弹窗正常打开/关闭
- [ ] 导出功能正常
- [ ] 移动端正常显示

---

## 🆘 故障排查

### 问题1: 页面空白

**可能原因**:
- JavaScript 文件加载失败
- API 接口不可用
- 浏览器控制台有错误

**解决方案**:
1. 按 F12 打开开发者工具查看控制台错误
2. 检查网络请求是否成功
3. 确认文件路径正确

### 问题2: 图表不显示

**可能原因**:
- ECharts CDN 加载失败
- DOM 元素未正确初始化

**解决方案**:
1. 检查 ECharts 是否加载成功
2. 确认图表容器有高度
3. 尝试刷新页面

### 问题3: 数据不更新

**可能原因**:
- 使用的是模拟数据
- API 接口未正确配置

**解决方案**:
1. 检查是否已连接真实API
2. 查看网络请求返回的数据
3. 确认数据格式正确

---

## 📞 技术支持

### 当前状态
- ✅ HTTP 服务器运行中
- ✅ 端口: 8000
- ✅ 所有文件就绪

### 访问地址
```
启动页: http://localhost:8000/start.html
V1版本: http://localhost:8000/index.html
V2版本: http://localhost:8000/index-v2.html (推荐)
```

### 服务器管理

**查看服务器状态**:
```bash
ps aux | grep "python3 -m http.server"
```

**停止服务器**:
找到进程ID后:
```bash
kill <PID>
```

**重启服务器**:
```bash
cd /Users/wongpeter/Desktop/usdt-exchange-page/risk-monitoring-system
python3 -m http.server 8000
```

---

## ✨ 下一步行动

### 立即体验
1. 打开浏览器
2. 访问 `http://localhost:8000/start.html`
3. 选择 V2 版本（推荐）
4. 开始探索各项功能

### 学习使用
1. 阅读《运营人员使用指南》
2. 了解各个模块功能
3. 实践常见操作场景

### 准备部署
1. 测试所有功能
2. 连接真实API
3. 配置生产环境
4. 上线运行

---

**祝使用愉快！如有问题，请查看文档或联系技术支持。** 🚀




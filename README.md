# 博客系统后端 API

一个基于 Node.js + Express + TypeScript + SQLite 构建的现代化博客系统后端服务，提供完整的博客功能 API 接口。

## 🔗 相关项目

- **前端项目**: [CF-Blog-System-frontend](https://github.com/yunduan-CloudForge/CF-Blog-System-frontend) - 博客系统前端应用，基于 React + TypeScript + Vite 构建
- **API 文档**: [Apifox 在线文档](https://cf-blog-system.apifox.cn) - 完整的 API 接口文档和测试工具

## 🚀 项目特性

### 核心功能
- **用户系统**：注册、登录、JWT 认证、角色权限管理
- **文章管理**：文章 CRUD、分类标签、草稿发布、搜索筛选
- **评论系统**：多级评论、点赞功能、评论管理
- **文件上传**：图片上传、文件管理
- **权限控制**：基于角色的访问控制 (RBAC)
- **系统管理**：后台管理、系统设置、操作日志

### 技术特性
- **TypeScript**：完整的类型安全支持
- **模块化设计**：清晰的项目结构和代码组织
- **数据库迁移**：自动化数据库初始化和版本管理
- **中间件系统**：认证、权限、日志记录
- **错误处理**：统一的错误处理和响应格式
- **性能优化**：数据库索引、查询优化

## 🛠 技术栈

### 后端框架
- **Node.js** - JavaScript 运行时
- **Express.js** - Web 应用框架
- **TypeScript** - 类型安全的 JavaScript

### 数据库
- **SQLite3** - 轻量级关系型数据库
- **sqlite** - Promise 风格的 SQLite 驱动

### 认证与安全
- **jsonwebtoken** - JWT 令牌认证
- **bcryptjs** - 密码加密
- **cors** - 跨域资源共享

### 文件处理
- **multer** - 文件上传中间件
- **nodemailer** - 邮件发送服务

### 开发工具
- **tsx** - TypeScript 执行器
- **eslint** - 代码质量检查
- **nodemon** - 开发环境热重载

## 📦 安装和配置

### 环境要求
- Node.js >= 18.0.0
- npm 或 pnpm

### 1. 克隆项目
```bash
git clone <repository-url>
cd blog-backend
```

### 2. 安装依赖
```bash
npm install
# 或
pnpm install
```

### 3. 环境配置
复制环境变量配置文件：
```bash
cp .env.example .env.development
```

编辑 `.env.development` 文件，配置以下参数：
```env
# 服务器端口
PORT=3001

# 数据库配置
DB_PATH=./data/blog.db

# JWT 密钥（请修改为安全的密钥）
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# 邮件配置（可选）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# 文件上传配置
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# CORS 配置
CORS_ORIGIN=http://localhost:5173

# 环境模式
NODE_ENV=development

# 日志级别
LOG_LEVEL=debug

# 密码加密轮数
BCRYPT_ROUNDS=12
```

### 4. 启动服务

#### 开发模式
```bash
npm run dev
```

#### 生产模式
```bash
# 构建项目
npm run build

# 启动生产服务
npm start
```

### 5. 验证安装
访问 `http://localhost:3001/api/health` 应该返回：
```json
{
  "success": true,
  "message": "ok"
}
```

## 🗄️ 数据库结构

### 核心表结构

#### 用户表 (users)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'author', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 文章表 (articles)
```sql
CREATE TABLE articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT DEFAULT NULL,
  author_id INTEGER NOT NULL,
  category_id INTEGER DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 评论表 (comments)
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT NULL,
  likes INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 数据库初始化
项目启动时会自动执行以下操作：
1. 创建数据库文件（如果不存在）
2. 执行初始化 SQL 脚本
3. 运行数据库迁移
4. 创建默认用户和示例数据

### 默认用户账号
| 邮箱 | 密码 | 角色 | 用途 |
|------|------|------|------|
| admin@blog.com | admin123 | admin | 系统管理员 |
| demo@blog.com | demo123 | author | 演示博主 |
| user@blog.com | user123 | user | 普通用户 |

## 📚 API 接口文档

### 基础信息
- **Base URL**: `http://localhost:3001/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON

### 认证接口 (/auth)

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "用户名"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### 文章接口 (/articles)

#### 获取文章列表
```http
GET /api/articles?page=1&limit=10&search=关键词&category=1&tag=1&status=published
```

#### 获取文章详情
```http
GET /api/articles/:id
```

#### 创建文章
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "文章标题",
  "content": "文章内容",
  "summary": "文章摘要",
  "category_id": 1,
  "tag_ids": [1, 2, 3],
  "status": "published"
}
```

#### 更新文章
```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json
```

#### 删除文章
```http
DELETE /api/articles/:id
Authorization: Bearer <token>
```

#### 点赞文章
```http
POST /api/articles/:id/like
Authorization: Bearer <token>
```

### 评论接口 (/comments)

#### 获取文章评论
```http
GET /api/comments?article_id=1&page=1&limit=10
```

#### 创建评论
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "评论内容",
  "article_id": 1
}
```

#### 回复评论
```http
POST /api/comments/:id/reply
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "回复内容"
}
```

### 分类接口 (/categories)

#### 获取分类列表
```http
GET /api/categories
```

#### 创建分类
```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "分类名称",
  "description": "分类描述"
}
```

### 标签接口 (/tags)

#### 获取标签列表
```http
GET /api/tags
```

#### 创建标签
```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "标签名称",
  "color": "#FF6B6B"
}
```

### 文件上传接口 (/upload)

#### 上传图片
```http
POST /api/upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <image-file>
```

### 管理员接口 (/admin)

#### 获取系统统计
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

#### 获取操作日志
```http
GET /api/admin/logs?page=1&limit=20
Authorization: Bearer <admin-token>
```

## 📁 项目结构

```
blog-backend/
├── src/                          # 源代码目录
│   ├── app.ts                   # Express 应用配置
│   ├── server.ts                # 服务器启动文件
│   ├── index.ts                 # 生产环境入口
│   ├── database/                # 数据库相关
│   │   ├── connection.ts        # 数据库连接和初始化
│   │   ├── init.sql            # 数据库初始化脚本
│   │   ├── admin_migration.sql  # 管理员权限系统迁移
│   │   ├── comment_migration.sql # 评论系统迁移
│   │   ├── likes_migration.sql  # 点赞系统迁移
│   │   └── system_settings_migration.sql # 系统设置迁移
│   ├── middleware/              # 中间件
│   │   ├── auth.ts             # 认证中间件
│   │   ├── rbac.ts             # 权限控制中间件
│   │   └── logger.ts           # 日志记录中间件
│   ├── routes/                  # 路由模块
│   │   ├── auth.ts             # 认证路由
│   │   ├── articles.ts         # 文章路由
│   │   ├── comments.ts         # 评论路由
│   │   ├── categories.ts       # 分类路由
│   │   ├── tags.ts             # 标签路由
│   │   ├── upload.ts           # 文件上传路由
│   │   ├── admin.ts            # 管理员路由
│   │   ├── users.ts            # 用户管理路由
│   │   └── profile.ts          # 用户资料路由
│   ├── utils/                   # 工具函数
│   │   └── queryOptimizer.ts   # 查询优化工具
│   └── websocket/               # WebSocket 服务
│       └── realtime.ts         # 实时数据服务
├── data/                        # 数据目录
│   └── blog.db                 # SQLite 数据库文件
├── uploads/                     # 文件上传目录
│   └── images/                 # 图片存储
├── dist/                        # 编译输出目录
├── .env.example                 # 环境变量示例
├── .env.development            # 开发环境配置
├── package.json                # 项目依赖配置
├── tsconfig.json               # TypeScript 配置
├── eslint.config.js            # ESLint 配置
└── README.md                   # 项目文档
```

## 🔧 开发指南

### 代码规范
- 使用 TypeScript 进行开发
- 遵循 ESLint 代码规范
- 使用 Prettier 格式化代码
- 编写清晰的注释和文档

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 类型检查
npm run check

# 代码检查
npm run lint

# 构建项目
npm run build

# 启动生产服务
npm start
```

### 数据库迁移
当需要修改数据库结构时：
1. 在 `src/database/` 目录下创建新的迁移文件
2. 在 `connection.ts` 中添加迁移执行逻辑
3. 重启服务器自动执行迁移

### 添加新的 API 路由
1. 在 `src/routes/` 目录下创建路由文件
2. 在 `app.ts` 中注册路由
3. 添加相应的中间件和权限控制

### 权限系统
项目使用基于角色的访问控制 (RBAC)：
- **user**: 普通用户，可以查看内容、发表评论
- **author**: 作者，可以创建和管理自己的文章
- **admin**: 管理员，拥有所有权限

使用权限中间件：
```typescript
import { requirePermission } from '../middleware/rbac';

// 需要特定权限
router.get('/admin-only', authMiddleware, requirePermission('admin.read'), handler);

// 需要任一权限
router.post('/content', authMiddleware, requireAnyPermission(['author.create', 'admin.create']), handler);
```

## 🚀 部署指南

### 生产环境部署

1. **环境准备**
   ```bash
   # 安装 Node.js 和 npm
   # 克隆项目代码
   git clone <repository-url>
   cd blog-backend
   ```

2. **安装依赖**
   ```bash
   npm ci --only=production
   ```

3. **环境配置**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，设置生产环境配置
   ```

4. **构建项目**
   ```bash
   npm run build
   ```

5. **启动服务**
   ```bash
   npm start
   ```

### Docker 部署

创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t blog-backend .
docker run -p 3001:3001 -v $(pwd)/data:/app/data blog-backend
```

### 反向代理配置 (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 🔧 Linux 部署故障排除

#### ❌ 连接拒绝错误 (ERR_CONNECTION_REFUSED)

这是最常见的前后端连接问题，当前端尝试连接后端时出现 `ERR_CONNECTION_REFUSED` 错误。

**🔍 错误原因分析**
- 后端服务未启动或已崩溃
- 端口配置错误或端口被占用
- 防火墙阻止了连接请求
- 网络配置问题或路由错误
- 前端 API 地址配置错误

**🛠️ 快速排查步骤**

1. **检查后端服务状态**
   ```bash
   # 检查 Node.js 进程是否运行
   ps aux | grep node
   
   # 检查端口是否被监听
   netstat -tlnp | grep 3001
   # 或使用 ss 命令
   ss -tlnp | grep 3001
   ```

2. **验证服务启动**
   ```bash
   # 如果服务未运行，启动服务
   npm start
   
   # 或使用 PM2 管理
   pm2 start npm --name "blog-backend" -- start
   pm2 status
   ```

3. **测试本地连接**
   ```bash
   # 测试健康检查接口
   curl http://localhost:3001/api/health
   
   # 测试登录接口
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@blog.com","password":"admin123"}'
   ```

4. **检查防火墙设置**
   ```bash
   # UFW 防火墙
   sudo ufw status
   sudo ufw allow 3001
   
   # iptables 防火墙
   sudo iptables -L | grep 3001
   sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
   ```

5. **验证前端配置**
   ```bash
   # 检查前端环境变量
   # 确保 VITE_API_BASE_URL 指向正确的后端地址
   echo $VITE_API_BASE_URL
   
   # 生产环境应该是：
   # VITE_API_BASE_URL=http://your-server-ip:3001
   # 或
   # VITE_API_BASE_URL=https://your-domain.com
   ```

**🚀 常见解决方案**

- **PM2 进程管理**
  ```bash
  # 安装 PM2
  npm install -g pm2
  
  # 启动应用
  pm2 start npm --name "blog-backend" -- start
  
  # 设置开机自启
  pm2 startup
  pm2 save
  ```

- **systemd 服务配置**
  ```bash
  # 创建服务文件
  sudo nano /etc/systemd/system/blog-backend.service
  
  # 服务文件内容：
  [Unit]
  Description=Blog Backend Service
  After=network.target
  
  [Service]
  Type=simple
  User=your-user
  WorkingDirectory=/path/to/blog-backend
  ExecStart=/usr/bin/npm start
  Restart=always
  
  [Install]
  WantedBy=multi-user.target
  
  # 启用并启动服务
  sudo systemctl enable blog-backend
  sudo systemctl start blog-backend
  ```

- **Docker 容器网络**
  ```bash
  # 确保容器端口正确映射
  docker run -p 3001:3001 blog-backend
  
  # 检查容器状态
  docker ps
  docker logs container-name
  ```

**⚠️ 重要提示**
- 确保后端服务监听 `0.0.0.0:3001` 而不是 `127.0.0.1:3001`
- 检查云服务商的安全组设置，开放 3001 端口
- 如果使用域名，确保 DNS 解析正确

#### ❌ 混合内容错误 (Mixed Content)

当前端使用 HTTPS 访问但后端 API 为 HTTP 时，浏览器会阻止这种不安全的请求，显示 "Mixed Content" 错误。

**🔍 错误原因分析**
- HTTPS 页面无法请求 HTTP 资源（浏览器安全策略）
- 前后端协议不匹配（前端 HTTPS，后端 HTTP）
- SSL 证书配置不当或缺失
- 反向代理配置错误

**🛠️ 解决方案选项**

**方案一：为后端配置 HTTPS/SSL 证书**

1. **使用 Let's Encrypt 免费证书**
   ```bash
   # 安装 Certbot
   sudo apt update
   sudo apt install certbot
   
   # 申请证书
   sudo certbot certonly --standalone -d yourdomain.com
   
   # 证书文件位置
   # /etc/letsencrypt/live/yourdomain.com/fullchain.pem
   # /etc/letsencrypt/live/yourdomain.com/privkey.pem
   ```

2. **Node.js HTTPS 服务器配置**
   ```javascript
   // app.js 或 server.js
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem'),
     cert: fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/fullchain.pem')
   };
   
   https.createServer(options, app).listen(3001, '0.0.0.0', () => {
     console.log('HTTPS Server running on port 3001');
   });
   ```

**方案二：使用 Nginx 反向代理统一协议**

1. **Nginx SSL 配置示例**
   ```nginx
   # /etc/nginx/sites-available/blog
   server {
       listen 80;
       server_name yourdomain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yourdomain.com;
   
       ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   
       # 前端静态文件
       location / {
           root /var/www/blog-frontend/dist;
           try_files $uri $uri/ /index.html;
       }
   
       # 后端 API 代理
       location /api/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

2. **启用 Nginx 配置**
   ```bash
   # 创建软链接
   sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
   
   # 测试配置
   sudo nginx -t
   
   # 重启 Nginx
   sudo systemctl restart nginx
   ```

**方案三：Apache 反向代理配置**

```apache
# /etc/apache2/sites-available/blog.conf
<VirtualHost *:80>
    ServerName yourdomain.com
    Redirect permanent / https://yourdomain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName yourdomain.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/yourdomain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/yourdomain.com/privkey.pem
    
    DocumentRoot /var/www/blog-frontend/dist
    
    # API 代理
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:3001/
    ProxyPassReverse /api/ http://localhost:3001/
</VirtualHost>
```

**🔧 开发环境临时解决方案**

1. **前端代理配置（vite.config.js）**
   ```javascript
   // vite.config.js
   export default {
     server: {
       proxy: {
         '/api': {
           target: 'http://localhost:3001',
           changeOrigin: true,
           secure: false
         }
       }
     }
   }
   ```

2. **浏览器安全设置调整（仅开发环境）**
   ```bash
   # Chrome 启动参数（仅用于开发测试）
   google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
   
   # 或在浏览器地址栏输入：
   # chrome://flags/#block-insecure-private-network-requests
   # 设置为 "Disabled"
   ```

3. **本地开发证书生成**
   ```bash
   # 使用 mkcert 生成本地证书
   # 安装 mkcert
   curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
   chmod +x mkcert-v*-linux-amd64
   sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
   
   # 安装根证书
   mkcert -install
   
   # 生成本地证书
   mkcert localhost 127.0.0.1 ::1
   ```

**🚀 推荐解决方案**

对于生产环境，强烈推荐使用 **Nginx 反向代理 + Let's Encrypt SSL 证书** 的方案：

1. **统一域名和协议**：前后端都通过 HTTPS 访问
2. **安全性高**：符合现代 Web 安全标准
3. **性能优化**：Nginx 可以处理静态文件和负载均衡
4. **维护简单**：证书自动续期，配置相对简单

**⚠️ 重要提示**
- 生产环境必须使用 HTTPS，避免 Mixed Content 问题
- 确保前端环境变量 `VITE_API_BASE_URL` 使用 HTTPS 协议
- 定期检查 SSL 证书有效期，设置自动续期
- 测试所有 API 接口在 HTTPS 环境下的正常工作

#### ❌ 404 Not Found 错误

**错误原因分析：**
- API 路由配置错误或未正确注册
- 域名解析问题，请求未到达正确的服务器
- 反向代理配置错误，路径转发不正确
- 后端服务路径与前端请求路径不匹配
- 后端服务未启动或崩溃

**排查步骤：**

1. **检查后端服务状态**
   ```bash
   # 检查服务是否运行
   ps aux | grep node
   netstat -tlnp | grep :3001
   
   # 检查服务日志
   pm2 logs blog-backend
   # 或
   journalctl -u blog-backend -f
   ```

2. **验证本地 API 访问**
   ```bash
   # 测试本地 API
   curl http://localhost:3001/api/health
   curl http://localhost:3001/api/auth/login -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

3. **检查路由配置**
   ```bash
   # 查看 app.ts 中的路由注册
   grep -n "app.use" src/app.ts
   grep -n "router" src/routes/
   ```

4. **检查域名解析**
   ```bash
   # 验证域名解析
   nslookup yourdomain.com
   ping yourdomain.com
   
   # 检查 DNS 配置
   dig yourdomain.com
   ```

**常见解决方案：**

1. **检查 Express 路由注册**
   ```javascript
   // 确保在 app.ts 中正确注册路由
   import authRoutes from './routes/auth';
   
   app.use('/api/auth', authRoutes);
   app.use('/api', routes); // 确保基础路由已注册
   ```

2. **验证 API 基础路径配置**
   ```javascript
   // 检查路由文件中的路径定义
   // routes/auth.ts
   router.post('/login', loginController); // 对应 /api/auth/login
   ```

3. **Nginx 反向代理路径配置**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location /api {
           proxy_pass http://localhost:3001/api;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
       
       # 确保根路径也能访问
       location / {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
       }
   }
   ```

4. **前端 API_BASE_URL 配置检查**
   ```bash
   # 检查前端环境变量
   cat .env.production
   # 确保配置正确
   VITE_API_BASE_URL=https://yourdomain.com/api
   ```

**调试方法：**

1. **使用 curl 测试具体 API 端点**
   ```bash
   # 测试健康检查端点
   curl -v https://yourdomain.com/api/health
   
   # 测试登录端点
   curl -v -X POST https://yourdomain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   
   # 检查响应头
   curl -I https://yourdomain.com/api/auth/login
   ```

2. **检查服务器访问日志**
   ```bash
   # Nginx 访问日志
   tail -f /var/log/nginx/access.log
   
   # 应用日志
   pm2 logs blog-backend --lines 50
   ```

3. **验证路由中间件**
   ```javascript
   // 添加调试中间件
   app.use((req, res, next) => {
     console.log(`${req.method} ${req.path}`);
     next();
   });
   ```

**配置检查清单：**

- [ ] 后端服务正常运行（端口 3001）
- [ ] app.ts 中路由正确注册
- [ ] 环境变量配置正确
- [ ] Nginx 配置文件语法正确
- [ ] 域名 DNS 解析正确
- [ ] 防火墙允许相应端口
- [ ] SSL 证书配置正确（如使用 HTTPS）
- [ ] 前端 API_BASE_URL 配置匹配

**快速修复步骤：**
```bash
# 1. 重启后端服务
pm2 restart blog-backend

# 2. 重新加载 Nginx 配置
sudo nginx -t && sudo nginx -s reload

# 3. 检查服务状态
curl http://localhost:3001/api/health

# 4. 测试外部访问
curl https://yourdomain.com/api/health
```

#### 🌐 域名和DNS配置问题

**问题描述：**
当前端尝试访问 `https://blogapi.yunforge.xyz` 时返回404错误，通常表明域名解析或服务器配置存在问题。

**🔍 域名配置检查：**

**1. DNS解析验证**
```bash
# 检查域名解析
dig blogapi.yunforge.xyz
nslookup blogapi.yunforge.xyz

# 检查A记录
dig A blogapi.yunforge.xyz

# 检查CNAME记录
dig CNAME blogapi.yunforge.xyz

# 使用公共DNS测试
dig @8.8.8.8 blogapi.yunforge.xyz
dig @1.1.1.1 blogapi.yunforge.xyz
```

**2. 域名指向服务器IP确认**
```bash
# 获取服务器公网IP
curl ifconfig.me
# 或
wget -qO- ifconfig.me

# 比较域名解析IP与服务器IP是否一致
ping blogapi.yunforge.xyz
```

**🖥️ 服务器配置验证：**

**1. 检查服务器监听端口**
```bash
# 检查所有监听端口
sudo netstat -tlnp

# 检查特定端口
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000

# 使用ss命令
sudo ss -tlnp | grep :80
```

**2. 验证防火墙和安全组配置**
```bash
# 检查UFW防火墙状态
sudo ufw status verbose

# 检查iptables规则
sudo iptables -L -n

# 检查端口是否对外开放
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
```

**3. 确认Nginx虚拟主机配置**
```bash
# 检查Nginx配置文件
sudo nginx -t

# 查看站点配置
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# 检查域名配置
sudo cat /etc/nginx/sites-available/blogapi.yunforge.xyz
```

**正确的Nginx虚拟主机配置示例：**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name blogapi.yunforge.xyz;
    
    # HTTP重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name blogapi.yunforge.xyz;
    
    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/blogapi.yunforge.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blogapi.yunforge.xyz/privkey.pem;
    
    # API代理配置
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
    }
    
    # 根路径处理
    location / {
        return 404;
    }
}
```

**🔒 SSL证书配置：**

**1. 证书域名匹配检查**
```bash
# 检查证书信息
openssl x509 -in /etc/letsencrypt/live/blogapi.yunforge.xyz/cert.pem -text -noout

# 检查证书域名
openssl x509 -in /etc/letsencrypt/live/blogapi.yunforge.xyz/cert.pem -noout -subject

# 检查证书有效期
openssl x509 -in /etc/letsencrypt/live/blogapi.yunforge.xyz/cert.pem -noout -dates
```

**2. Let's Encrypt证书申请**
```bash
# 安装certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 申请证书
sudo certbot --nginx -d blogapi.yunforge.xyz

# 测试自动续期
sudo certbot renew --dry-run
```

**3. 证书有效性验证**
```bash
# 在线检查SSL证书
curl -I https://blogapi.yunforge.xyz

# 详细SSL信息
openssl s_client -connect blogapi.yunforge.xyz:443 -servername blogapi.yunforge.xyz
```

**🔧 调试步骤：**

**1. DNS调试**
```bash
# 全球DNS传播检查
# 访问 https://www.whatsmydns.net/ 输入域名检查

# 本地DNS缓存清理
sudo systemctl flush-dns  # Ubuntu
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns  # Windows
```

**2. 直接IP访问测试**
```bash
# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me)
echo "服务器IP: $SERVER_IP"

# 直接通过IP访问API
curl -H "Host: blogapi.yunforge.xyz" http://$SERVER_IP/api/auth/login
curl -H "Host: blogapi.yunforge.xyz" https://$SERVER_IP/api/auth/login -k
```

**3. 端口连通性测试**
```bash
# 测试端口连通性
telnet blogapi.yunforge.xyz 80
telnet blogapi.yunforge.xyz 443

# 使用nc测试
nc -zv blogapi.yunforge.xyz 80
nc -zv blogapi.yunforge.xyz 443

# 使用nmap扫描
nmap -p 80,443 blogapi.yunforge.xyz
```

**💡 常见解决方案：**

**1. DNS传播等待时间**
- DNS记录修改后需要24-48小时全球传播
- 使用 `dig @8.8.8.8 blogapi.yunforge.xyz` 检查是否已传播
- 临时修改本地hosts文件进行测试：
```bash
# 编辑hosts文件
sudo nano /etc/hosts
# 添加记录
你的服务器IP blogapi.yunforge.xyz
```

**2. 云服务商域名解析配置**
```bash
# 阿里云DNS配置示例
记录类型: A
主机记录: blogapi
解析线路: 默认
记录值: 你的服务器公网IP
TTL: 600

# 腾讯云DNS配置示例
主机记录: blogapi
记录类型: A
线路类型: 默认
记录值: 你的服务器公网IP
TTL: 600秒
```

**3. CDN和代理服务配置**
```bash
# 如果使用Cloudflare，检查代理状态
# 橙色云朵 = 代理开启
# 灰色云朵 = 仅DNS

# 临时关闭CDN代理进行测试
# 在Cloudflare面板中点击橙色云朵变为灰色
```

**📋 生产环境部署检查清单：**

**域名配置：**
- [ ] 域名DNS记录正确配置（A记录指向服务器IP）
- [ ] DNS传播完成（全球可解析）
- [ ] 域名备案完成（如在中国大陆）
- [ ] 子域名配置正确（blogapi.yunforge.xyz）

**服务器配置：**
- [ ] 服务器公网IP正确
- [ ] 防火墙开放80、443端口
- [ ] 安全组规则配置正确
- [ ] Nginx服务正常运行
- [ ] 虚拟主机配置正确

**SSL证书：**
- [ ] SSL证书申请成功
- [ ] 证书域名匹配
- [ ] 证书未过期
- [ ] 证书链完整
- [ ] HTTPS重定向配置

**应用服务：**
- [ ] 后端服务正常运行
- [ ] 端口监听正确（3000）
- [ ] API路由配置正确
- [ ] 代理转发配置正确

**网络连通性：**
- [ ] 域名可正常解析
- [ ] 80/443端口可访问
- [ ] API接口可正常调用
- [ ] CORS配置正确

**⚠️ 特别注意：**
- 确保域名解析的IP地址与服务器实际IP一致
- 检查是否有多层代理（CDN、负载均衡器等）影响
- 验证SSL证书是否包含所有需要的域名
- 确认服务器时间正确，避免证书时间验证失败
- 检查是否有地域限制或网络策略阻止访问

---

当在 Linux 服务器上部署后前端无法连接后端时，请按以下步骤进行排查：

#### 1. 网络连接检查

**检查后端服务状态**
```bash
# 检查服务是否运行
ps aux | grep node

# 检查端口监听状态
netstat -tlnp | grep 3001
# 或使用 ss 命令
ss -tlnp | grep 3001

# 检查服务日志
journalctl -u your-service-name -f
# 或查看 PM2 日志
pm2 logs
```

**测试本地 API 访问**
```bash
# 测试健康检查接口
curl http://localhost:3001/api/health

# 测试登录接口
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blog.com","password":"admin123"}'
```

#### 2. 防火墙配置

**UFW 防火墙配置**
```bash
# 检查防火墙状态
sudo ufw status

# 开放 3001 端口
sudo ufw allow 3001

# 如果使用 Nginx 代理，开放 80 和 443 端口
sudo ufw allow 80
sudo ufw allow 443

# 重新加载防火墙规则
sudo ufw reload
```

**iptables 防火墙配置**
```bash
# 检查当前规则
sudo iptables -L

# 开放 3001 端口
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT

# 保存规则（Ubuntu/Debian）
sudo iptables-save > /etc/iptables/rules.v4

# 保存规则（CentOS/RHEL）
sudo service iptables save
```

#### 3. CORS 配置检查

**检查环境变量**
```bash
# 查看当前环境变量
cat .env

# 确保 CORS_ORIGIN 配置正确
echo $CORS_ORIGIN
```

**生产环境 CORS 配置示例**
```env
# 单个域名
CORS_ORIGIN=https://yourdomain.com

# 多个域名（用逗号分隔）
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# 开发环境（允许所有域名，仅用于测试）
CORS_ORIGIN=*
```

#### 4. 环境变量配置

**后端环境变量检查**
```bash
# 生产环境配置示例
cat > .env << EOF
PORT=3001
NODE_ENV=production
JWT_SECRET=your-production-secret-key
CORS_ORIGIN=https://yourdomain.com
DB_PATH=./data/blog.db
EOF
```

**前端环境变量配置**
```bash
# 前端 .env 文件配置
VITE_API_BASE_URL=https://yourdomain.com
# 或者如果使用子路径
VITE_API_BASE_URL=https://yourdomain.com/api
```

#### 5. 常见问题和解决方案

**端口占用问题**
```bash
# 查找占用 3001 端口的进程
sudo lsof -i :3001

# 杀死占用端口的进程
sudo kill -9 <PID>

# 或者更改端口
export PORT=3002
npm start
```

**权限问题**
```bash
# 检查文件权限
ls -la

# 修改文件所有者
sudo chown -R $USER:$USER .

# 修改文件权限
chmod -R 755 .

# 确保数据目录可写
chmod 755 data/
chmod 644 data/blog.db
```

**网络策略问题**
```bash
# 检查 SELinux 状态（CentOS/RHEL）
getenforce

# 临时禁用 SELinux（仅用于测试）
sudo setenforce 0

# 检查网络连接
ping yourdomain.com
nslookup yourdomain.com
```

#### 6. 调试命令和工具

**服务状态检查**
```bash
# 使用 PM2 管理服务
pm2 start npm --name "blog-backend" -- start
pm2 status
pm2 logs blog-backend
pm2 restart blog-backend

# 使用 systemd 管理服务
sudo systemctl status blog-backend
sudo systemctl restart blog-backend
sudo journalctl -u blog-backend -f
```

**网络连接测试**
```bash
# 测试从服务器到前端的连接
curl -I https://yourdomain.com

# 测试 DNS 解析
nslookup yourdomain.com
dig yourdomain.com

# 测试端口连通性
telnet yourdomain.com 80
nc -zv yourdomain.com 80
```

**详细的 API 测试**
```bash
# 测试完整的 API 流程
#!/bin/bash

# 1. 测试健康检查
echo "Testing health endpoint..."
curl -s http://localhost:3001/api/health | jq

# 2. 测试用户登录
echo "Testing login..."
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@blog.com","password":"admin123"}' | jq -r '.data.token')

echo "Token: $TOKEN"

# 3. 测试需要认证的接口
echo "Testing authenticated endpoint..."
curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/admin/stats | jq
```

**日志分析**
```bash
# 实时查看应用日志
tail -f logs/app.log

# 查看 Nginx 访问日志
sudo tail -f /var/log/nginx/access.log

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# 查看系统日志
sudo journalctl -f
```

#### 7. 完整的部署检查清单

- [ ] 后端服务正常启动并监听正确端口
- [ ] 防火墙已开放必要端口（3001, 80, 443）
- [ ] CORS_ORIGIN 配置包含前端域名
- [ ] 前端 API_BASE_URL 指向正确的后端地址
- [ ] SSL 证书配置正确（如果使用 HTTPS）
- [ ] 数据库文件权限正确
- [ ] 环境变量配置完整
- [ ] 反向代理配置正确（如果使用）
- [ ] DNS 解析正常
- [ ] 网络连接畅通

如果以上步骤都检查无误但仍然无法连接，请检查云服务商的安全组设置，确保已开放相应端口的入站规则。

## 🤝 贡献指南

### 贡献流程
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码贡献规范
- 遵循现有的代码风格
- 添加适当的测试
- 更新相关文档
- 确保所有测试通过

### 问题报告
如果发现 bug 或有功能建议，请：
1. 检查是否已有相关 issue
2. 创建新的 issue，详细描述问题
3. 提供复现步骤和环境信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**Happy Coding! 🎉**
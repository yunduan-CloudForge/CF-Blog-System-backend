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
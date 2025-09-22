/**
 * 临时简化服务器，用于测试前端功能
 */
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 简单的健康检查
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 模拟文章API
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    data: {
      articles: [
        {
          id: 1,
          title: '欢迎使用博客系统',
          content: '这是一个示例文章，用于测试前端功能。',
          author: 'Admin',
          created_at: new Date().toISOString(),
          category: '技术',
          tags: ['React', 'TypeScript']
        }
      ],
      total: 1
    }
  });
});

// 模拟分类API
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: '技术', count: 1 },
      { id: 2, name: '生活', count: 0 }
    ]
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API not found'
  });
});

app.listen(PORT, () => {
  console.log(`临时服务器运行在端口 ${PORT}`);
});

export default app;
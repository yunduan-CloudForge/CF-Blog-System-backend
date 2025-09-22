/**
 * 后端项目入口文件
 * 用于生产环境部署
 */

import dotenv from 'dotenv';
import app from './app.js';
import { initializeDatabase } from './database/connection.js';

// 加载环境变量
dotenv.config();

// 初始化数据库
initializeDatabase().catch(console.error);

// 启动服务器
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`博客系统后端服务已启动，端口: ${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

export default app;
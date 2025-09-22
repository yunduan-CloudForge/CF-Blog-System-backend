/**
 * 创建admin_logs表的脚本
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data/blog.db');

const db = new sqlite3.Database(dbPath);

// 创建admin_logs表
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS admin_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'success',
    level TEXT DEFAULT 'info',
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`;

// 创建索引
const createIndexes = [
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_user_id ON admin_logs(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action)',
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_resource ON admin_logs(resource)',
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_status ON admin_logs(status)',
  'CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at)'
];

console.log('开始创建admin_logs表...');

db.run(createTableSQL, (err) => {
  if (err) {
    console.error('创建admin_logs表失败:', err);
    process.exit(1);
  }
  
  console.log('admin_logs表创建成功');
  
  // 创建索引
  let indexCount = 0;
  createIndexes.forEach((indexSQL, index) => {
    db.run(indexSQL, (err) => {
      if (err) {
        console.error(`创建索引${index + 1}失败:`, err);
      } else {
        console.log(`索引${index + 1}创建成功`);
      }
      
      indexCount++;
      if (indexCount === createIndexes.length) {
        // 插入一条测试日志
        const insertTestLog = `
          INSERT INTO admin_logs (user_id, action, resource, details, ip_address, status, level)
          VALUES (1, 'system_init', 'admin_logs', '{"message":"系统初始化创建admin_logs表"}', '127.0.0.1', 'success', 'info')
        `;
        
        db.run(insertTestLog, (err) => {
          if (err) {
            console.error('插入测试日志失败:', err);
          } else {
            console.log('测试日志插入成功');
          }
          
          db.close((err) => {
            if (err) {
              console.error('关闭数据库连接失败:', err);
            } else {
              console.log('数据库连接已关闭');
              console.log('admin_logs表创建完成！');
            }
          });
        });
      }
    });
  });
});
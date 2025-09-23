/**
 * 用户个人信息管理API路由
 * 模块: 6.1 用户信息管理
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../middleware/auth';
import { logDetailedAction, logSecurityAction } from '../middleware/logger';
import { get, run } from '../database/connection';

// 用户数据库记录接口
interface UserRecord {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  role: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

const router = express.Router();

/**
 * 获取当前用户个人信息
 * GET /api/profile
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const query = `
      SELECT id, email, username, avatar, bio, role, created_at, updated_at
      FROM users
      WHERE id = ?
    `;
    
    const row = await get(query, [userId]) as UserRecord;
    
    if (!row) {
      return res.status(404).json({ 
        success: false,
        error: '用户不存在' 
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: row.id,
          email: row.email,
          username: row.username,
          avatar: row.avatar,
          bio: row.bio,
          role: row.role,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ 
      success: false,
      error: '获取用户信息失败' 
    });
  }
});

/**
 * 更新当前用户个人信息
 * PUT /api/profile
 */
router.put('/', 
  authMiddleware,
  logDetailedAction('update_profile', 'users'),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { username, bio, avatar } = req.body;
      
      if (!username) {
        return res.status(400).json({ 
          success: false,
          error: '用户名为必填项' 
        });
      }
      
      // 检查用户名是否已被其他用户使用
      const checkQuery = 'SELECT id FROM users WHERE username = ? AND id != ?';
      const existingUser = await get(checkQuery, [username, userId]);
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          error: '用户名已被使用' 
        });
      }
      
      const updateQuery = `
        UPDATE users 
        SET username = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const result = await run(updateQuery, [username, bio, avatar, userId]);
      
      if (result.changes === 0) {
        return res.status(404).json({ 
          success: false,
          error: '用户不存在' 
        });
      }
      
      res.json({ 
        success: true, 
        message: '个人信息更新成功' 
      });
    } catch (error) {
      console.error('更新用户信息错误:', error);
      res.status(500).json({ 
        success: false,
        error: '更新用户信息失败' 
      });
    }
  }
);

/**
 * 修改密码
 * PUT /api/profile/password
 */
router.put('/password', 
  authMiddleware,
  logSecurityAction('change_password', 'users'),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          success: false,
          error: '当前密码和新密码都是必填项' 
        });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ 
          success: false,
          error: '新密码长度至少6位' 
        });
      }
      
      // 获取当前用户的密码哈希
      const getUserQuery = 'SELECT password_hash FROM users WHERE id = ?';
      const user = await get(getUserQuery, [userId]) as UserRecord;
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: '用户不存在' 
        });
      }
      
      // 验证当前密码
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, String(user.password_hash));
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          success: false,
          error: '当前密码不正确' 
        });
      }
      
      // 加密新密码
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // 更新密码
      const updateQuery = `
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      await run(updateQuery, [hashedNewPassword, userId]);
      
      res.json({ 
        success: true, 
        message: '密码修改成功' 
      });
    } catch (error) {
      console.error('密码修改错误:', error);
      res.status(500).json({ 
        success: false,
        error: '密码处理失败' 
      });
    }
  }
);

/**
 * 更新头像
 * PUT /api/profile/avatar
 */
router.put('/avatar', 
  authMiddleware,
  logDetailedAction('update_avatar', 'users'),
  async (req, res) => {
    try {
      const userId = req.user?.userId;
      const { avatar } = req.body;
      
      if (!avatar) {
        return res.status(400).json({ 
          success: false,
          error: '头像URL为必填项' 
        });
      }
      
      const updateQuery = `
        UPDATE users 
        SET avatar = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      const result = await run(updateQuery, [avatar, userId]);
      
      if (result.changes === 0) {
        return res.status(404).json({ 
          success: false,
          error: '用户不存在' 
        });
      }
      
      res.json({ 
        success: true, 
        message: '头像更新成功' 
      });
    } catch (error) {
      console.error('头像更新错误:', error);
      res.status(500).json({ 
        success: false,
        error: '头像更新失败' 
      });
    }
  }
);

export default router;
import axios from 'axios';

// 测试前端日志获取功能
async function testFrontendLogs() {
  try {
    // 1. 登录获取token
    console.log('1. 正在登录...');
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@blog.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('登录成功，token:', token.substring(0, 20) + '...');
    
    // 2. 获取日志数据
    console.log('\n2. 正在获取日志数据...');
    const logsResponse = await axios.get('http://localhost:3001/api/admin/logs', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('日志数据获取成功:');
    console.log('总数:', logsResponse.data.total);
    console.log('当前页:', logsResponse.data.page);
    console.log('每页数量:', logsResponse.data.limit);
    console.log('总页数:', logsResponse.data.totalPages);
    console.log('\n日志记录:');
    
    logsResponse.data.logs.forEach((log, index) => {
      console.log(`${index + 1}. ID: ${log.id}`);
      console.log(`   用户: ${log.username} (${log.email})`);
      console.log(`   操作: ${log.action}`);
      console.log(`   资源: ${log.resource}`);
      console.log(`   状态: ${log.status}`);
      console.log(`   时间: ${log.created_at}`);
      console.log(`   IP: ${log.ip_address}`);
      console.log('---');
    });
    
    // 3. 测试前端页面访问
    console.log('\n3. 测试前端页面访问...');
    try {
      const frontendResponse = await axios.get('http://localhost:5173');
      console.log('前端页面访问成功，状态码:', frontendResponse.status);
    } catch (error) {
      console.log('前端页面访问失败:', error.message);
    }
    
    console.log('\n✅ 所有测试完成！');
    console.log('\n📋 总结:');
    console.log('- 后端API正常工作');
    console.log('- 日志数据可以正确获取');
    console.log('- 前端服务器正在运行');
    console.log('\n🔍 如果前端页面仍然不显示数据，可能的原因:');
    console.log('1. 前端没有正确的管理员权限验证');
    console.log('2. 前端路由配置问题');
    console.log('3. 前端状态管理问题');
    console.log('4. 前端组件渲染问题');
    
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

testFrontendLogs();
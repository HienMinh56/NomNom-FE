/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getUsers() {
    try {
      const agent = new https.Agent({ rejectUnauthorized: false });
      const response = await axios.get('https://localhost:7253/api/User/view-all-users', { httpsAgent: agent });
  
      if (response.data.isSuccess) {
        const users = response.data.data;
  
        // Separate users by role
        const adminsAndShippers = users.filter(user => user.role === 1 || user.role === 3);
        const customers = users.filter(user => user.role === 2);
  
        // Trả về tất cả người dùng cùng với phân loại của họ
        return { users, adminsAndShippers, customers };
      } else {
        // Trả về lỗi nếu không thành công
        return { error: 'Failed to fetch users' };
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Trả về lỗi nếu có lỗi xảy ra
      return { error: 'An error occurred while fetching users' };
    }
  }
  
  module.exports = {
    getUsers
  };
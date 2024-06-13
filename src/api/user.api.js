/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getUsers(filters = {}) {
  try {
      const agent = new https.Agent({ rejectUnauthorized: false });
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`https://localhost:7253/api/v1/user?${queryParams}`, {httpsAgent: agent});

      if (response.data.isSuccess) {
          const users = response.data.data;

          const adminsAndShippers = users.filter(user => user.role === 1 || user.role === 3);
          const customers = users.filter(user => user.role === 2);

          return { users, adminsAndShippers, customers };
      } else {
          return { error: 'Failed to fetch users' };
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      return { error: 'An error occurred while fetching users' };
  }
}


async function addUser(userData) {
  try {
      const response = await axios.post(
          'https://localhost:7253/api/v1/account',
          userData,
          {
              httpsAgent: new https.Agent({ rejectUnauthorized: false }),
              headers: {
                  'Content-Type': 'application/json',
              },
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error adding user:', error);
      return { error: 'An error occurred while adding the user' };
  }
}


async function updateUser(userId, userData) {
  try {
    const response = await axios.put(
      `https://localhost:7253/api/v1/user?userId=${userId}`, 
      userData, 
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: 'An error occurred while updating the user' };
  }
}


async function deleteUser(userId) {
  try {
    const response = await axios.delete('https://localhost:7253/api/v1/user', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'Content-Type': 'application/json',
      },
      data: { userId },
    });

    if (response.data.isSuccess) {
      return response.data;
    } else {
      return { error: 'Failed to delete user' };
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'An error occurred while deleting the user' };
  }
}

  
module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser
};
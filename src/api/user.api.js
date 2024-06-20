/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');
const authManager = require('../config/auth.config');

async function getUsers(userId, filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const accessToken = authManager.getAccessToken();
        
        const url = userId 
            ? `${apiConfig.BASE_URL}/user?userId=${userId}&${queryParams}`
            : `${apiConfig.BASE_URL}/user?${queryParams}`;

        // console.log('Request URL:', url); // Debug: In ra URL để kiểm tra
        
        const response = await axios.get(url, {
            httpsAgent: agent,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

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
        const accessToken = authManager.getAccessToken();
        const response = await axios.post(
            `${apiConfig.BASE_URL}/account`,
            userData,
            {
                httpsAgent: agent,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
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
        const accessToken = authManager.getAccessToken();
        const response = await axios.put(
            `${apiConfig.BASE_URL}/user/${userId}`,
            userData,
            {
                httpsAgent: agent,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
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
        const accessToken = authManager.getAccessToken();
        const response = await axios.delete(`${apiConfig.BASE_URL}/user`, {
            httpsAgent: agent,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
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

module.exports = { getUsers, addUser, updateUser, deleteUser };
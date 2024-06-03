/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');

async function login(username, password) {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post(`https://localhost:7253/api/Authorize/Login?userName=${username}&password=${password}`, {}, { httpsAgent: agent });

    if (response.data.accessTokenToken && response.data.refreshToken) {
      return {
        success: true,
        accessToken: response.data.accessTokenToken,
        refreshToken: response.data.refreshToken,
        expiredAt: response.data.expiredAt
      };
    } else {
      return { success: false, message: 'Login failed' };
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'An error occurred during login' };
  }
}

module.exports = {
  login
};
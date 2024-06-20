/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const jwt = require('jsonwebtoken');
const apiConfig = require('../config/api.config');
const authManager = require('../config/auth.config');

async function auth(username, password) {
  try {
    const response = await axios.post(
      `${apiConfig.BASE_URL}/authorize/login?userName=${username}&password=${password}`, 
      {},
      { httpsAgent: agent }
    );

    if (response.data.accessTokenToken && response.data.refreshToken) {
      const decodedToken = jwt.verify(response.data.accessTokenToken, apiConfig.SECRET_KEY);

      // Lưu trữ token vào authManager
      authManager.setTokens(response.data.accessTokenToken, decodedToken);

      return {
        success: true,
        accessToken: response.data.accessTokenToken,
        refreshToken: response.data.refreshToken,
        expiredAt: response.data.expiredAt,
        userInfo: decodedToken
      };
    } else {
      return { success: false, message: 'Login failed' };
    }
  } catch (error) {
    console.error('Error logging in:', error);

    if (error.response) {
      return { success: false, message: error.response.data.message || 'An error occurred during login' };
    } else if (error.request) {
      return { success: false, message: 'No response from server' };
    } else {
      return { success: false, message: 'Request setup error' };
    }
  }
}

module.exports = { auth };
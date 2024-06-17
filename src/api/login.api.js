/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const jwt = require('jsonwebtoken');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function login(username, password) {
  try {
    const response = await axios.post(
      `${apiConfig.BASE_URL}/authorize/login?userName=${username}&password=${password}`,
      {}, 
      { httpsAgent: agent }
    );

    if (response.data.accessTokenToken && response.data.refreshToken) {
      // Decode the token using the secret key
      const decodedToken = jwt.verify(response.data.accessTokenToken, apiConfig.SECRET_KEY);

      // Save token into localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('accessToken', response.data.accessTokenToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

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
    return { success: false, message: 'An error occurred during login' };
  }
}

module.exports = {
  login
};
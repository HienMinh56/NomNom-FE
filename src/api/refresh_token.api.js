/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';

const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function refresh(refreshToken, expiredAt) {
  try {
    const response = await axios.post(`${apiConfig.BASE_URL}/authorize/refresh-access-token`, {
      refreshToken: refreshToken,
      expiredAt: expiredAt,
    }, { httpsAgent: agent });

    if (response.data.isSuccess) {
      const decodedToken = jwt.verify(response.data.data.accessTokenToken, apiConfig.SECRET_KEY);
      
      // Store tokens in authManager
      authManager.setTokens(response.data.data.accessTokenToken, decodedToken);

      return {
        success: true,
        accessToken: response.data.data.accessTokenToken,
        refreshToken: response.data.data.refreshToken,
        expiredAt: response.data.data.expiredAt,
        userInfo: decodedToken
      };
    } else {
      return {
        success: false,
        message: response.data.message
      };
    }
  } catch (error) {
    console.error('Error in API refresh call:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = { refresh };
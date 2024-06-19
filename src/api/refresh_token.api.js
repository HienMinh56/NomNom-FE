/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function refresh(refreshToken) {
  try {
    const response = await axios.post(`${apiConfig.BASE_URL}/authorize/refresh-access-token`, {
      refreshToken: refreshToken
    }, { httpsAgent: agent });

    if (response.data.isSuccess) {
      return {
        success: true,
        accessToken: response.data.data.accessTokenToken,
        refreshToken: response.data.data.refreshToken,
        expiredAt: response.data.data.expiredAt
      };
    } else {
      return {
        success: false,
        message: response.data.message
      };
    }
  } catch (error) {
    console.error('Error in API refresh call:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = { refresh };
/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');

async function refresh(refreshToken, accessToken) {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.post('https://localhost:7253/api/Authorize/RefreshAccessToken', {
      accessTokenToken: accessToken,
      refreshToken: refreshToken
    }, { httpsAgent: agent });

    if (response.data.isSuccess) {
      return {
        success: true,
        accessToken: response.data.accessTokenToken,
        expiredAt: response.data.expiredAt
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
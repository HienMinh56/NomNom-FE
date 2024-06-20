/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


async function refresh(refreshToken, expiredAt) {
  try {
    // console.log('Sending request:', { refreshToken, expiredAt});

    const response = await axios.post(`${apiConfig.BASE_URL}/authorize/refresh-access-token`, {
      refreshToken: refreshToken,
      expiredAt: expiredAt,
    }, { httpsAgent: agent });

    // console.log('Response data:', response.data);

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
    console.error('Error in API refresh call:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = { refresh };
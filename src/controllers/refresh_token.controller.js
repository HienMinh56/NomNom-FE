/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const refreshApi = require('../api/refresh_token.api');

async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  try {
    const result = await refreshApi.refresh(refreshToken);

    if (result.success) {
      const accessToken = result.accessToken;
      const newRefreshToken = result.refreshToken;
      const expiredAt = new Date(result.expiredAt);

      res.cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

      const refreshTokenMaxAge = expiredAt - new Date();
      res.cookie('refreshToken', newRefreshToken, {
        maxAge: refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

      res.status(200).json({
        success: true,
        accessToken: accessToken,
        refreshToken: newRefreshToken,
        expiredAt: expiredAt
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error in refresh-token route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = { refreshToken };

/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const refreshApi = require('../api/refresh_token.api');

async function refreshToken(req, res) {
  const { refreshToken, expiredAt } = req.body;

  try {
    const result = await refreshApi.refresh(refreshToken, expiredAt);

    if (result.success) {
      const accessToken = result.accessToken;
      const newRefreshToken = result.refreshToken;
      const expiredAt = new Date(result.expiredAt);
      const accessTokenMaxAge = 60 * 60 * 1000; 
      const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

      res.cookie('accessToken', accessToken, {
        maxAge: accessTokenMaxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

      res.cookie('refreshToken', newRefreshToken, {
        maxAge: refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

      res.cookie('expiredAt', expiredAt.toISOString(), {
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
      console.error('Failed to refresh token:', result.message);
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
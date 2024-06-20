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

const authenticatedUser = async (req, res, next) => {
  const { accessToken, refreshToken, expiredAt } = req.cookies;

  // console.log('Cookies:', { accessToken, refreshToken, expiredAt });

  if (!accessToken && !refreshToken) {
    return res.redirect('/login');
  }

  if ( (!accessToken || accessToken === undefined) && refreshToken) {
    try {
      console.log('Attempting to refresh token with:', { refreshToken, expiredAt });

      const response = await axios.post(
        `${apiConfig.BASE_URL}/authorize/refresh-access-token`,
        { refreshToken, expiredAt },
        { httpsAgent: agent }
      );

      console.log('Refresh API response:', response.data);

      if (response.data.isSuccess) {
        const newAccessToken = response.data.data.accessTokenToken;
        const newRefreshToken = response.data.data.refreshToken;
        const expiredAt = new Date(response.data.data.expiredAt);

        res.cookie('accessToken', newAccessToken, {
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

        req.cookies.accessToken = newAccessToken; // Update req.cookies to continue processing other middleware
        const decodedToken = jwt.verify(newAccessToken, apiConfig.SECRET_KEY);
        // Lưu trữ token vào authManager
        authManager.setTokens(newAccessToken, decodedToken);

      } else {
        console.error('Failed to refresh token:', response.data.message);
        return res.redirect('/login');
      }
    } catch (error) {
      console.error('Error refreshing token:', error.response ? error.response.data : error.message);
      return res.redirect('/login');
    }
  }

  next();
};

module.exports = authenticatedUser;
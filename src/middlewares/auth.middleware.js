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

  if (!accessToken && !refreshToken) {
    return res.redirect('/login');
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await axios.post(
        `${apiConfig.BASE_URL}/authorize/refresh-access-token`,
        { refreshToken, expiredAt },
        { httpsAgent: agent }
      );

      if (response.data.isSuccess) {
        const newAccessToken = response.data.data.accessTokenToken;
        const newRefreshToken = response.data.data.refreshToken;
        const newExpiredAt = new Date(response.data.data.expiredAt);
        const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes
        const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // 1 week

        res.cookie('accessToken', newAccessToken, {
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

        res.cookie('expiredAt', newExpiredAt.toISOString(), {
          maxAge: refreshTokenMaxAge,
          httpOnly: true,
          secure: true,
          sameSite: 'Strict'
        });

        req.cookies.accessToken = newAccessToken;
        const decodedToken = jwt.verify(newAccessToken, apiConfig.SECRET_KEY);

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
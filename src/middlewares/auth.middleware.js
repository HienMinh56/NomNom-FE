/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

const authenticatedUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.redirect('/login');
  }

  if (!accessToken && refreshToken) {
    try {
      const response = await axios.post(
        `${apiConfig.BASE_URL}/authorize/refresh-access-token`,
        { refreshToken },
        { httpsAgent: agent }
      );

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
      } else {
        return res.redirect('/login');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.redirect('/login');
    }
  }

  next();
};

module.exports = authenticatedUser;
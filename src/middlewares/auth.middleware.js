/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const { refresh } = require('../api/refresh_token.api');

async function tokenMiddleware(req, res, next) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    if (!refreshToken) {
      return res.redirect('/login');
    } else {
      // Call the refresh token API
      const refreshResponse = await refresh(refreshToken, accessToken);

      if (refreshResponse.success) {
        // Set new access token in cookies
        res.cookie('accessToken', refreshResponse.accessToken, { httpOnly: true });
        // Proceed to the next middleware or route handler
        return next();
      } else {
        // Redirect to login if refresh failed
        return res.redirect('/login');
      }
    }
  } else {
    // Proceed to the next middleware or route handler if accessToken is valid
    return next();
  }
}

module.exports = {
  tokenMiddleware
}
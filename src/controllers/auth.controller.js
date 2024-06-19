/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const jwt = require('jsonwebtoken');
const authApi = require('../api/auth.api');

async function auth (req, res) {
    const { username, password } = req.body;
    try {
      const result = await authApi.auth(username, password);
  
      //console.log('Login API response:', result); // Debug log
  
      if (result.success) {
        // Check if the user role is equal to 1
        if (result.userInfo.Role == "1") {
  
          // Save the tokens into cookies
          // Generate access token with no specific expiration time (valid until the session ends)
          const accessTokenMaxAge = 15 * 60 * 1000; // 15 minutes in milliseconds
          const ONE_WEEK = 604800000;
          const accessToken = jwt.sign({ user: result.userInfo }, process.env.SECRET_KEY);
          res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
          res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, maxAge: ONE_WEEK });
          res.cookie('userInfo', result.userInfo, { httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
          res.redirect('/');
        } else {
          res.render('pages/login', { error: 'You do not have permission to access the dashboard' });
        }
      } else {
        res.render('pages/login', { error: result.message });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.render('pages/login', { error: 'An error occurred during login' });
    }
};

module.exports = { auth }
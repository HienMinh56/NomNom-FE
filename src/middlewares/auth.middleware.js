/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const { refresh } = require('../api/refresh_token.api');

async function tokenMiddleware(req, res, next) {
  let { accessToken, refreshToken } = req.cookies;

  if (!accessToken) {
    if (!refreshToken) {
      return res.redirect('/login');
    } else {
      // Gọi API refresh token
      const refreshResponse = await refresh(refreshToken, accessToken);

      if (refreshResponse.success) {
        // Cập nhật access token mới vào cookie và localStorage
        res.cookie('accessToken', refreshResponse.accessToken, { httpOnly: true });
        localStorage.setItem('accessToken', refreshResponse.accessToken);
        // Tiếp tục tới middleware hoặc route handler tiếp theo
        return next();
      } else {
        // Chuyển tới trang login nếu refresh thất bại
        return res.redirect('/login');
      }
    }
  } else {
    // Tiếp tục tới middleware hoặc route handler tiếp theo nếu accessToken hợp lệ
    return next();
  }
}


module.exports = {
  tokenMiddleware
}
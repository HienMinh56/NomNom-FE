/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


async function tokenMiddleware(req, res, next) {
  let { accessToken } = req.cookies;

  if (!accessToken) {
    return res.redirect('/login');
  }
}

module.exports = { tokenMiddleware }
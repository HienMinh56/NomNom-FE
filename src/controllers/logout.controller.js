/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('expiredAt');
    res.redirect('/login');
}


module.exports = { logout }
/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const login = (req, res) => {
    const { accessToken, refreshToken } = req.cookies;
    if (accessToken && refreshToken) {
        return res.redirect('/');
    } else {
        res.render('./pages/login');
    }    
}

module.exports = { login }
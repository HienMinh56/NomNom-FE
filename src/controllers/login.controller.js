/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const login = (req, res) => {
    const { username, password } = req.cookies;
    if (username && password) {
        return res.redirect('/dashboard');
    } else {
        res.render('./pages/login');
    }
}


module.exports = { login }
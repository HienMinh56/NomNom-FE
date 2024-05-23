/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const authenticatedUser = (req, res, next) => {
    const {
        access_token,
        refresh_token,
        username,
        password
    } = req.cookies;

    // if (access_token && !refresh_token) {
    //     return res.redirect('/auth');
    // } else if (!access_token && !refresh_token) {
    //     return res.redirect('/login');
    // } else if (!access_token && refresh_token) {
    //     return res.redirect(`/auth/refresh_token?redirect=${req.originalUrl}`);
    // }
    if (!username && !password) {
        return res.redirect('/login');
    } else if (!username || !password) {
        return res.redirect('/login');
    } else if (username && password){
        next();
    }
    //next();
}


module.exports = authenticatedUser;
/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const refreshTokenController = require('../controllers/refresh_token.controller');
const resetPasswordController = require('../controllers/reset_password.controller');

router.post('/', authController.auth);
router.post('/refresh_token', refreshTokenController.refreshToken);
router.post('/reset_mail', resetPasswordController.resetMail);

module.exports = router;
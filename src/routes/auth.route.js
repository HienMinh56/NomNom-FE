/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const refreshTokenController = require('../controllers/refresh_token.controller');

router.post('/', authController.auth);
router.post('/refresh_token', refreshTokenController.refreshToken);

module.exports = router;
/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

router.get('/', loginController.login);

module.exports = router;
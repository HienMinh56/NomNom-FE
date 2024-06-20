/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const { logout } = require('../controllers/logout.controller');

router.get('/', logout);

module.exports = router;
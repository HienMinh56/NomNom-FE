/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';

/**
 * Node modules
 */
const router = require('express').Router();

/**
 * Custom modules
 */
const { dashboard } = require('../controllers/dashboard.controller');

router.get('/', dashboard);

module.exports = router;
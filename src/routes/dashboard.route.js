/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const orderController = require('../controllers/order.controller');


router.get('/', dashboardController.getItems);
router.get('/data-chart', orderController.dataChart);
router.get('/total-earn', orderController.getTotalEarn);
router.get('/data-dashboard', orderController.getDataDashboard);

module.exports = router;
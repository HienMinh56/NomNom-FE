/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const orderApi = require('../api/order.api');


async function getOrders(req, res) {
    const { userName, createdDate, status, storeName, sessionId } = req.query;

    const filters = {};
    if (userName !== undefined) filters.userName = userName;
    if (createdDate !== undefined) filters.createdDate = createdDate;
    if (status !== undefined) filters.status = status;
    if (storeName !== undefined) filters.storeName = storeName;
    if (sessionId !== undefined) filters.sessionId = sessionId;

    try {
        const orderData = await orderApi.getOrders(filters);

        if (orderData.error) {
            res.render('./pages/order', { text: 'Order', orders: [] });
        } else {
            res.render('./pages/order', { text: 'Order', orders: orderData.orders });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.render('./pages/order', { text: 'Order', orders: [] });
    }
}

async function dataChart(req, res) {
    const { type, month, year } = req.query;

    try {
        const chartData = await orderApi.dataChart(type, month, year);
        res.json(chartData);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'An error occurred while updating the product' });
    }
}

module.exports = { getOrders, dataChart }
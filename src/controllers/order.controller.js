/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const orderApi = require('../api/order.api');


async function getOrders(req, res) {
    const { userId, createdDate, status, storeName, sessionId } = req.query;

    const filters = {};
    if (userId !== undefined) filters.userId = userId;
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

module.exports = { getOrders }
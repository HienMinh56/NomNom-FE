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

async function getOrderDetail(req, res) {
    const { orderId } = req.params;

    try {
        const orderDetail = await orderApi.getOrderDetail(orderId);

        if (orderDetail.error) {
            res.render('./pages/order_detail', { text: 'Order', orderDetails: [] });
        } else {
            res.render('./pages/order_detail', { text: 'Order', orderDetails: orderDetail.orders });
        }
    } catch (error) {
        console.error('Error fetching orderDetail:', error);
        res.render('./pages/order_detail', { text: 'Order', orderDetails: [] });
    }
}

async function getTotalEarn(req, res) {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const currentDateEarnings = await orderApi.getTotalEarn(currentDate, currentDate);

        const { startDate, endDate } = req.query;
        let userSelectedDateEarnings = {};

        if (startDate && endDate) {
            userSelectedDateEarnings = await orderApi.getTotalEarn(startDate, endDate);
        }

        res.json({
            currentDateEarnings,
            userSelectedDateEarnings
        });
    } catch (error) {
        console.error('Error getting totalEarn:', error);
        res.status(500).json({ error: 'An error occurred while getting totalEarn' });
    }
}

async function dataChart(req, res) {
    const { type, month, year } = req.query;

    try {
        const chartData = await orderApi.dataChart(type, month, year);
        res.json(chartData);
    } catch (error) {
        console.error('Error getting dataChart:', error);
        res.status(500).json({ error: 'An error occurred while getting dataChart' });
    }
}

async function getDataDashboard(req, res) {
    try {
        const data = await orderApi.getDataDashboard();
        res.json(data);
    } catch (error) {
        console.error('Error getting getDataDashboard:', error);
        res.status(500).json({ error: 'An error occurred while getting getDataDashboard' });
    }
}


module.exports = { getOrders, getOrderDetail, getTotalEarn, dataChart, getDataDashboard }
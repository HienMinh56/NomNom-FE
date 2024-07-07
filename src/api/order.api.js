/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function getOrders(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${apiConfig.BASE_URL}/order?${queryParams}`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            let orders = response.data.data;
            orders = orders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

            return { orders };
        } else {
            return { error: 'Failed to fetch orders' };
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { error: 'An error occurred while fetching orders' };
    }
}


async function getOrderDetail(orderId) {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/order-details?orderId=${orderId}`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const orders = response.data.data; 

            return { orders };
        } else {
            return { error: 'Failed to fetch orders' };
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return { error: 'An error occurred while fetching orders' };
    }
}


async function getTotalEarn(startDate, endDate) {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/order/totalAmount?startDate=${startDate}&&endDate=${endDate}`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const data = response.data.data;

            return data;
        }
    } catch (error) {
        console.error('Error fetching earnings:', error);
        return { error: 'An error occurred while fetching earnings' };
    }
}


async function dataChart(type, month, year) {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/order/data-chart?type=${type}&year=${year}&month=${month}`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const data = response.data.data;
            const chartData = {
                labels: data.map(item => new Date(item.date).toLocaleDateString('vn-VN', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: "Total Amount",
                    data: data.map(item => item.totalAmount)
                }]
            };
            return { data: chartData };
        } else {
            return { error: 'Failed to fetch data' };
        }
    } catch (error) {
        console.error('Error generating data chart:', error);
        return { error: 'An error occurred while generating data chart' };
    }
}

async function getDataDashboard() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/order/dataDashboard`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const data = response.data.data;

            return data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'An error occurred while fetching data' };
    }
}


module.exports = { getOrders, getTotalEarn, getOrderDetail, dataChart, getDataDashboard }
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
        const response = await axios.get(`${apiConfig.BASE_URL}/order/totalInCome?startDate=${startDate}&&endDate=${endDate}`, { httpsAgent: agent });

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
        const response = await axios.get(`${apiConfig.BASE_URL}/dashboard/time?type=${type}&year=${year}&month=${month}`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const data = response.data.data;
            let chartData = {
                labels: [],
                datasets: [{
                    label: "Total Amount",
                    data: []
                }]
            };

            if (type === 'day') {
                chartData.labels = data.map(item => {
                    const dateParts = item.day.split('-');
                    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                });
                chartData.datasets[0].data = data.map(item => item.totalAmount);
            } else if (type === 'week') {
                chartData.labels = data.map(item => item.weekNumber);
                chartData.datasets[0].data = data.map(item => item.totalAmount);
            } else if (type === 'month') {
                chartData.labels = data.map(item => "month " + item.month);
                chartData.datasets[0].data = data.map(item => item.totalAmount);
            }

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
        const response = await axios.get(`${apiConfig.BASE_URL}/dashboard/total`, { httpsAgent: agent });

        if (response.data.isSuccess) {
            const data = response.data.data;

            return data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'An error occurred while fetching data' };
    }
}


async function endOfDay() {
    try {
        const response = await axios.put(`${apiConfig.BASE_URL}/order/AllStatuses`,{} , { httpsAgent: agent });

        if (response.data.isSuccess) {
            return response.data;
        } else {
            return { error: 'Failed to end shift of day' };
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'An error occurred while end shift of day' };
    }
}


module.exports = { getOrders, getTotalEarn, getOrderDetail, dataChart, getDataDashboard, endOfDay }
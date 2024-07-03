/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function getTransaction(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await axios.get(`${apiConfig.BASE_URL}/transaction?${queryParams}`, { httpsAgent: agent });
        const transactions = response.data.data;
        if (response.data.isSuccess) {
            return { transactions };
        } else {
            return { error: 'Failed to fetch transactions' };
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { error: 'An error occurred while fetching transactions' };
    }
}

module.exports = {
    getTransaction
}
/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function getOrders() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/order`, { httpsAgent: agent });
        const order = response.data.data;
        if (response.data.isSuccess) {
            return { order };
        } else {
            return { error: 'Failed to fetch Orders' };
        }
    } catch (error) {
        console.error('Error fetching Orders:', error);
        return { error: 'An error occurred while fetching Orders' };
    }
}


module.exports = {
    getOrders
}
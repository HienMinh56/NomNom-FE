/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getOrders() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get('https://localhost:7253/api/v1/order', { httpsAgent: agent });

        if (response.data.isSuccess) {
            return response.data.data;
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
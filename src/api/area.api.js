/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getAreas() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get('https://localhost:7253/api/v1/area', { httpsAgent: agent });
        const areas = response.data.data;
        if (response.data.isSuccess) {
            return { areas };
        } else {
            return { error: 'Failed to fetch areas' };
        }
    } catch (error) {
        console.error('Error fetching areas:', error);
        return { error: 'An error occurred while fetching areas' };
    }
}


module.exports = {
    getAreas
}
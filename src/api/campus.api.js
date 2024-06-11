/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getCampus() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get('https://localhost:7253/api/Campus/GetCampus', { httpsAgent: agent });
        const campuses = response.data.data;
        if (response.data.isSuccess) {
            return { campuses };
        } else {
            return { error: 'Failed to fetch campuses' };
        }
    } catch (error) {
        console.error('Error fetching campuses:', error);
        return { error: 'An error occurred while fetching campuses' };
    }
}


module.exports = {
    getCampus
}
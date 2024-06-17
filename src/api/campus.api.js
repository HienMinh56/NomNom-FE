/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function getCampus() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/campus`, { httpsAgent: agent });
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


module.exports = { getCampus }
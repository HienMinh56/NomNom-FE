/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');

async function resetMail(email) {
    try {
        const response = await axios.post(
            `${apiConfig.BASE_URL}/account/send-reset-email`,
            `"${email}"`,  // Ensure the email is sent as a plain string with double quotes
            {
                httpsAgent: agent,
                headers: {
                  'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.log(email);
        console.error('Error sending mail:', error.response?.data || error.message);
        return { error: 'An error occurred while sending mail' };
    }
}

module.exports = { resetMail };
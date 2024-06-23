/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const mailApi = require('../api/reset_password.api');

async function resetMail(req, res) {
    const email = req.body.email;  // Access email property directly
    console.log('Email received:', email);

    try {
        const result = await mailApi.resetMail(email);
        res.json(result);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'An error occurred while sending email' });
    }
}

module.exports = { resetMail };
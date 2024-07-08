/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const transactionApi = require('../api/transaction.api');


async function getTransactions(req, res) {
    const { userId, createdDate } = req.query;

    const filters = {};
    if (userId !== undefined) filters.userId = userId;
    if (createdDate !== undefined) filters.createdDate = createdDate;

    try {
        const transactionData = await transactionApi.getTransaction(filters);

        if (transactionData.error) {
            res.render('./pages/transaction', { text: 'Transaction', transactions: [] });
        } else {
            res.render('./pages/transaction', { text: 'Transaction', transactions: transactionData.transactions });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.render('./pages/transaction', { text: 'Transaction', transactions: [] });
    }
}

module.exports = { getTransactions }
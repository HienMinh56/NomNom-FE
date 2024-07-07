/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const storeApi = require('../api/store.api');
const orderApi = require('../api/order.api');

async function getItems(req, res) {
    let { status, areaName, sessionId, userName, createdDate, storeName } = req.query;

    const filtersStore = {};
    if (status !== undefined) filters.status = status;
    if (areaName !== undefined) filters.areaName = areaName;
    if (sessionId !== undefined) filters.sessionId = sessionId;

    const filtersOrder = {};
    if (userName !== undefined) filters.userName = userName;
    if (createdDate !== undefined) filters.createdDate = createdDate;
    if (status !== undefined) filters.status = status;
    if (storeName !== undefined) filters.storeName = storeName;
    if (sessionId !== undefined) filters.sessionId = sessionId;

    try {
        const storeData = await storeApi.getStores(filtersStore);
        const orderData = await orderApi.getOrders(filtersOrder);

        if (storeData.error || orderData.error) {
            res.render('./pages/dashboard', { text: 'Dashboard', stores: [], orders: []});
        } else {
            const activeStores = storeData.stores.filter(store => store.status === 1);
            const todayOrders = orderData.orders.filter(order => order.createdDate === Date.now());
            res.render('./pages/dashboard', { text: 'Dashboard', stores: activeStores , orders: todayOrders });
        }
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.render('./pages/dashboard', { text: 'Dashboard', stores: [], areas: [], orders: []});
    }
}


module.exports = { getItems }
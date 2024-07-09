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
    if (status !== undefined) filtersStore.status = status;
    if (areaName !== undefined) filtersStore.areaName = areaName;
    if (sessionId !== undefined) filtersStore.sessionId = sessionId;

    const filtersOrder = {};
    if (userName !== undefined) filtersOrder.userName = userName;
    if (createdDate !== undefined) filtersOrder.createdDate = createdDate;
    if (status !== undefined) filtersOrder.status = status;
    if (storeName !== undefined) filtersOrder.storeName = storeName;
    if (sessionId !== undefined) filtersOrder.sessionId = sessionId;

    try {
        const storeData = await storeApi.getStores(filtersStore);
        const orderData = await orderApi.getOrders(filtersOrder);

        if (storeData.error || orderData.error) {
            res.render('./pages/dashboard', { text: 'Dashboard', stores: [], orders: [] });
        } else {
            const activeStores = storeData.stores.filter(store => store.status === 1);
            
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            
            const todayOrders = orderData.orders.filter(order => {
                const orderDate = new Date(order.createdDate);
                return orderDate >= startOfDay && orderDate <= endOfDay;
            });

            res.render('./pages/dashboard', { text: 'Dashboard', stores: activeStores, orders: todayOrders });
        }
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.render('./pages/dashboard', { text: 'Dashboard', stores: [], areas: [], orders: [] });
    }
}


module.exports = { getItems }
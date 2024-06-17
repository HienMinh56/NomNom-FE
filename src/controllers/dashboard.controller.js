/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const storeApi = require('../api/store.api');
const areaApi = require('../api/area.api');

async function getItems(req, res) {
  const { status, areaName, sessionId } = req.query;

  const filters = {};
  if (status !== undefined) filters.status = status;
  if (areaName !== undefined) filters.areaName = areaName;
  if (sessionId !== undefined) filters.sessionId = sessionId;

  try {
      const storeData = await storeApi.getStores(filters);
      const areaData = await areaApi.getAreas();

      if (storeData.error || areaData.error) {
          res.render('./pages/dashboard', { text: 'Dashboard', stores: [], areas: [] });
      } else {
          res.render('./pages/dashboard', { text: 'Dashboard', ...storeData, areas: areaData.areas });
      }
  } catch (error) {
      console.error('Error fetching stores:', error);
      res.render('./pages/dashboard', { text: 'Dashboard', stores: [], areas: [] });
  }
}

module.exports = { getItems }
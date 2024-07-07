/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const storeApi = require('../api/store.api');
const areaApi = require('../api/area.api');

async function getStores(req, res) {
  const { Name, StoreId, status, areaName, sessionId } = req.query;

  const filters = {};
  if (Name !== undefined) filters.Name = Name;
  if (StoreId !== undefined) filters.StoreId = StoreId;
  if (status !== undefined) filters.status = status;
  if (areaName !== undefined) filters.areaName = areaName;
  if (sessionId !== undefined) filters.sessionId = sessionId;

  try {
      const storeData = await storeApi.getStores(filters);
      const areaData = await areaApi.getAreas();

      if (storeData.error || areaData.error) {
          res.render('./pages/store', { text: 'Store', stores: [], areas: [] });
      } else {
          res.render('./pages/store', { text: 'Store', ...storeData, areas: areaData.areas });
      }
  } catch (error) {
      console.error('Error fetching stores:', error);
      res.render('./pages/store', { text: 'Store', stores: [], areas: [] });
  }
}

async function addStore(req, res) {
  const storeData = req.body;

  try {
    const result = await storeApi.addStore(storeData);
    res.json(result);
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ error: 'An error occurred while adding the store' });
  }
}

async function updateStore(req, res) {
  const storeId = req.query.storeId;
  const storeData = req.body;

  try {
    const result = await storeApi.updateStore(storeId, storeData);
    res.json(result);
  } catch (error) {
    console.error('Error updating store:', error);
    res.status(500).json({ error: 'An error occurred while updating the store' });
  }
}

async function deleteStore(req, res) {
  const { storeId } = req.body;

  try {
    const result = await storeApi.deleteStore(storeId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'An error occurred while deleting the store' });
  }
}

module.exports = { getStores, addStore, updateStore, deleteStore };
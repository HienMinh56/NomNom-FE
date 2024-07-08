/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');
const authManager = require('../config/auth.config');

const accessToken = authManager.getAccessToken();

async function getStores(filters = {}) {
  try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`${apiConfig.BASE_URL}/store?${queryParams}`, { httpsAgent: agent });

      if (response.data.isSuccess) {
          let stores = response.data.data;
          stores = stores.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          return { stores };
      } else {
          return { error: 'Failed to fetch stores' };
      }
  } catch (error) {
      console.error('Error fetching stores:', error);
      return { error: 'An error occurred while fetching stores' };
  }
}

async function addStore(storeData) {
  try {
      const response = await axios.post(
          `${apiConfig.BASE_URL}/store`,
          storeData,
          {
              httpsAgent: agent,
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error adding store:', error);
      return { error: 'An error occurred while adding the store' };
  }
}

async function updateStore(storeId, storeData) {
  try {
    const response = await axios.put(
      `${apiConfig.BASE_URL}/store/${storeId}`,
      storeData,
      {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating store:', error);
    return { error: 'An error occurred while updating the store' };
  }
}

async function deleteStore(storeId) {
  try {
    const response = await axios.delete(`${apiConfig.BASE_URL}/store`, {
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: { storeId },
    });

    if (response.data.isSuccess) {
      return response.data;
    } else {
      return { error: 'Failed to delete store' };
    }
  } catch (error) {
    console.error('Error deleting store:', error);
    return { error: 'An error occurred while deleting the store' };
  }
}

async function changeSession() {
  try {
    const response = await axios.post(
      `${apiConfig.BASE_URL}/store/status`, {}, { httpsAgent: agent }
    );
    if (response) {
      return response.data;
    } else {
      return { error: 'Failed to change session' };
    }
  } catch (error) {
    console.error('Error changing session:', error);
    return { error: 'An error occurred while changing session' };
  }
}

module.exports = { getStores, addStore, updateStore, deleteStore, changeSession };
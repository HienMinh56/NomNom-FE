/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getStores(filters = {}) {
  try {
      const agent = new https.Agent({ rejectUnauthorized: false });
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(`https://localhost:7253/api/v1/store?${queryParams}`, {httpsAgent: agent});

      if (response.data.isSuccess) {
          const stores = response.data.data;

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
          'https://localhost:7253/api/v1/store',
          storeData,
          {
              httpsAgent: new https.Agent({ rejectUnauthorized: false }),
              headers: {
                  'Content-Type': 'application/json',
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
      `https://localhost:7253/api/v1/store?storeId=${storeId}`,
      storeData,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          'Content-Type': 'application/json',
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
    const response = await axios.delete('https://localhost:7253/api/v1/store', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        'Content-Type': 'application/json',
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


module.exports = {
    getStores,
    addStore,
    updateStore,
    deleteStore
};
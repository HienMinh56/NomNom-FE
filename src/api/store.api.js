/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const axios = require('axios');
const https = require('https');


async function getStores() {
    try {
        const agent = new https.Agent({ rejectUnauthorized: false });
        const response = await axios.get('https://localhost:7253/api/Store/filterStore', { httpsAgent: agent });
        const stores = response.data;
        if (response.data) {
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
          'https://localhost:7253/api/Store/AddStore',
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
      `https://localhost:7253/api/Store/UpdateStore?storeId=${storeId}`,
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


module.exports = {
    getStores,
    addStore,
    updateStore
};
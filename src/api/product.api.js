/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

"use strict";

const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });
const apiConfig = require('../config/api.config');
const authManager = require('../config/auth.config');

const accessToken = authManager.getAccessToken();

async function getProducts(storeId, filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(
      `${apiConfig.BASE_URL}/food?storeId=${storeId}&${queryParams}`,
      { httpsAgent: agent }
    );

    if (response.data.isSuccess) {
      const foods = response.data.data;
      return { foods };
    } else {
      return { error: 'Failed to fetch products' };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'An error occurred while fetching products' };
  }
}

async function addProduct(storeId, foodData) {
  try {    
    const response = await axios.post(
      `$${apiConfig.BASE_URL}/food/${storeId}`,
      foodData,
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
    console.error('Error adding product:', error);
    return { error: 'An error occurred while adding the product' };
  }
}

async function updateProduct(foodId, foodData) {
  try {
    const response = await axios.put(
      `${apiConfig.BASE_URL}/food/${foodId}`,
      foodData,
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
    console.error('Error updating product:', error);
    return { error: 'An error occurred while updating the product' };
  }
}

async function deleteProduct(foodId) {
  try {
    const response = await axios.delete(`${apiConfig.BASE_URL}/food`, {
      httpsAgent: agent,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      data: { foodId },
    });

    if (response.data.isSuccess) {
      return response.data;
    } else {
      return { error: 'Failed to delete product' };
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return { error: 'An error occurred while deleting the product' };
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
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
const FormData = require('form-data');

async function getProducts(storeId, filters = {}) {
  try {
    const accessToken = authManager.getAccessToken();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(
      `${apiConfig.BASE_URL}/food?storeId=${storeId}&${queryParams}`, {
        httpsAgent: agent,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.isSuccess) {
      let foods = response.data.data.foods;
      foods = foods.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      return { foods };
    } else {
      return { error: 'Failed to fetch products' };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'An error occurred while fetching products' };
  }
}

async function addProduct(storeId, foodData, imageFile) {
  try {
    const accessToken = authManager.getAccessToken();
    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }
    formData.append('Image', imageFile.buffer, imageFile.originalname);

    const response = await axios.post(
      `${apiConfig.BASE_URL}/food/${storeId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...formData.getHeaders()
        },
        httpsAgent: agent,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return { error: 'An error occurred while adding the product' };
  }
}

async function updateProduct(foodId, foodData, imageFile) {
  try {
    const accessToken = authManager.getAccessToken();
    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }
    formData.append('Image', imageFile.buffer, imageFile.originalname); // Append image file

    const response = await axios.put(
      `${apiConfig.BASE_URL}/food/${foodId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...formData.getHeaders()
        },
        httpsAgent: agent,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return { error: 'An error occurred while updating the product' };
  }
}

async function deleteProduct(foodId) {
  try {
    const accessToken = authManager.getAccessToken();
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
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

async function getAreas() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/area`, { httpsAgent: agent });
        const areas = response.data.data;
        if (response.data.isSuccess) {
            return { areas };
        } else {
            return { error: 'Failed to fetch areas' };
        }
    } catch (error) {
        console.error('Error fetching areas:', error);
        return { error: 'An error occurred while fetching areas' };
    }
}

async function addArea(areaData) {
    try {
        const response = await axios.post(
            `${apiConfig.BASE_URL}/area`,
            areaData,
            {
                httpsAgent: agent,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
            }
        );
        if (response.data.isSuccess) {
          return response.data;
        } else {
          return { error: 'Failed to add area' };
        }
    } catch (error) {
        console.error('Error adding area:', error);
        return { error: 'An error occurred while adding the area' };
    }
}

async function updateArea(areaId, areaData) {
    try {
      const response = await axios.put(
        `${apiConfig.BASE_URL}/area/${areaId}`,
        areaData,
        {
          httpsAgent: agent,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return { error: 'Failed to update area' };
      }
    } catch (error) {
      console.error('Error updating area:', error);
      return { error: 'An error occurred while updating the area' };
    }
  }

async function deleteArea(areaId) {
    try {
      const response = await axios.delete(`${apiConfig.BASE_URL}/area/${areaId}`, {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
  
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return { error: 'Failed to delete area' };
      }
    } catch (error) {
      console.error('Error deleting area:', error);
      return { error: 'An error occurred while deleting the area' };
    }
  }


module.exports = { getAreas, addArea, updateArea, deleteArea };
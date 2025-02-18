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

async function getCampus() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/campus`, { httpsAgent: agent });
        const campuses = response.data.data;
        if (response.data.isSuccess) {
            return { campuses };
        } else {
            return { error: 'Failed to fetch campuses' };
        }
    } catch (error) {
        console.error('Error fetching campuses:', error);
        return { error: 'An error occurred while fetching campuses' };
    }
}

async function addCampus(campusData) {
    try {
        const response = await axios.post(
            `${apiConfig.BASE_URL}/campus`,
            campusData,
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
          return { error: 'Failed to add campus' };
        }
    } catch (error) {
        console.error('Error adding campus:', error);
        return { error: 'An error occurred while adding the campus' };
    }
}

async function updateCampus(campusId, campusData) {
    try {
      const response = await axios.put(
        `${apiConfig.BASE_URL}/campus/${campusId}`,
        campusData,
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
        return { error: 'Failed to update' };
      }
    } catch (error) {
      console.error('Error updating campus:', error);
      return { error: 'An error occurred while updating the campus' };
    }
  }

async function deleteCampus(campusId) {
    try {
      const response = await axios.delete(`${apiConfig.BASE_URL}/campus/${campusId}`, {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
  
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return { error: 'Failed to delete campus' };
      }
    } catch (error) {
      console.error('Error deleting campus:', error);
      return { error: 'An error occurred while deleting the campus' };
    }
  }


module.exports = { getCampus, addCampus, updateCampus, deleteCampus }
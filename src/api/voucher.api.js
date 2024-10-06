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

async function getVouchers() {
    try {
        const response = await axios.get(`${apiConfig.BASE_URL}/voucher`, { httpsAgent: agent });
        const vouchers = response.data.data;
        if (response.data.isSuccess) {
            return { vouchers };
        } else {
            return { error: 'Failed to fetch vouchers' };
        }
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        return { error: 'An error occurred while fetching vouchers' };
    }
}

async function addVoucher(voucherData) {
    try {
        const response = await axios.post(
            `${apiConfig.BASE_URL}/voucher`,
            voucherData,
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
          return { error: 'Failed to add voucher' };
        }
    } catch (error) {
        console.error('Error adding voucher:', error);
        return { error: 'An error occurred while adding the voucher' };
    }
}

async function updateVoucher(voucherId, voucherData) {
    try {
      const response = await axios.put(
        `${apiConfig.BASE_URL}/voucher/${voucherId}`,
        voucherData,
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
        return { error: 'Failed to update voucher' };
      }
    } catch (error) {
      console.error('Error updating voucher:', error);
      return { error: 'An error occurred while updating the voucher' };
    }
  }

async function deleteVoucher(voucherId) {
    try {
      const response = await axios.delete(`${apiConfig.BASE_URL}/voucher/${voucherId}`, {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
  
      if (response.data.isSuccess) {
        return response.data;
      } else {
        return { error: 'Failed to delete voucher' };
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      return { error: 'An error occurred while deleting the voucher' };
    }
  }


module.exports = { getVouchers, addVoucher, updateVoucher, deleteVoucher };
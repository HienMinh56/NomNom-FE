/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const areaApi = require('../api/area.api');
const campusApi = require('../api/campus.api');
const voucherApi = require('../api/voucher.api');

async function gets(req, res) {
  const { areaId, campusId, voucherId } = req.query;

  const filters = {};
  if (areaId !== undefined) filters.areaId = areaId;
  if (campusId !== undefined) filters.campusId = campusId;
  if (voucherId !== undefined) filters.voucherId = voucherId;

  try {
      const areaData = await areaApi.getAreas(filters);
      const campusData = await campusApi.getCampus(filters);
      const voucherData = await voucherApi.getVouchers(filters);

      if (campusData.error || areaData.error || voucherData.error) {
          res.render('./pages/other', { text: 'Other', areas: [], campuses: [], vouchers: [] });
      } else {
          res.render('./pages/other', { text: 'Other', ...areaData, ...campusData, ...voucherData });
      }
  } catch (error) {
      console.error('Error fetching others:', error);
      res.render('./pages/other', { text: 'Other', areas: [], campuses: [], vouchers: [] });
  }
}

async function addArea(req, res) {
  const areaData = req.body;

  try {
    const result = await areaApi.addArea(areaData);
    res.json(result);
  } catch (error) {
    console.error('Error adding area:', error);
    res.status(500).json({ error: 'An error occurred while adding the area' });
  }
}

async function addCampus(req, res) {
  const campusData = req.body;

  try {
    const result = await campusApi.addCampus(campusData);
    res.json(result);
  } catch (error) {
    console.error('Error adding campus:', error);
    res.status(500).json({ error: 'An error occurred while adding the campus' });
  }
}

async function addVoucher(req, res) {
  const voucherData = req.body;

  try {
    const result = await voucherApi.addVoucher(voucherData);
    res.json(result);
  } catch (error) {
    console.error('Error adding voucher:', error);
    res.status(500).json({ error: 'An error occurred while adding the voucher' });
  }
}

async function updateArea(req, res) {
  const areaId = req.query.areaId;
  const areaData = req.body;

  try {
    const result = await areaApi.updateArea(areaId, areaData);
    res.json(result);
  } catch (error) {
    console.error('Error updating area:', error);
    res.status(500).json({ error: 'An error occurred while updating the area' });
  }
}

async function updateCampus(req, res) {
  const campusId = req.query.campusId;
  const campusData = req.body;

  try {
    const result = await campusApi.updateCampus(campusId, campusData);
    res.json(result);
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({ error: 'An error occurred while updating the campus' });
  }
}

async function updateVoucher(req, res) {
  const voucherId = req.query.voucherId;
  const voucherData = req.body;

  try {
    const result = await voucherApi.updateVoucher(voucherId, voucherData);
    res.json(result);
  } catch (error) {
    console.error('Error updating voucher:', error);
    res.status(500).json({ error: 'An error occurred while updating the voucher' });
  }
}

async function deleteArea(req, res) {
  const areaId = req.query.areaId;

  try {
    const result = await areaApi.deleteArea(areaId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting area:', error);
    res.status(500).json({ error: 'An error occurred while deleting the area' });
  }
}

async function deleteCampus(req, res) {
  const campusId = req.query.campusId;

  try {
    const result = await campusApi.deleteCampus(campusId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting campus:', error);
    res.status(500).json({ error: 'An error occurred while deleting the campus' });
  }
}

async function deleteVoucher(req, res) {
  const voucherId = req.query.voucherId;

  try {
    const result = await voucherApi.deleteVoucher(voucherId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting voucher:', error);
    res.status(500).json({ error: 'An error occurred while deleting the voucher' });
  }
}


module.exports = { gets, addArea, addCampus, addVoucher, updateArea, updateCampus, updateVoucher, deleteArea, deleteCampus, deleteVoucher };
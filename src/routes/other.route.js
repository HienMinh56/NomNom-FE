/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const otherController = require('../controllers/other.controller');

router.get('/', otherController.gets);
router.post('/addArea', otherController.addArea);
router.post('/addCampus', otherController.addCampus);
router.post('/addVoucher', otherController.addVoucher);
router.put('/updateArea', otherController.updateArea);
router.put('/updateCampus', otherController.updateCampus);
router.put('/updateVoucher', otherController.updateVoucher);
router.delete('/deleteArea', otherController.deleteArea);
router.delete('/deleteCampus', otherController.deleteCampus);
router.delete('/deleteVoucher', otherController.deleteVoucher);

module.exports = router;
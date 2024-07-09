/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const productController = require('../controllers/product.controller');

router.get('/', storeController.getStores);
router.get('/:storeId', productController.getProducts);
router.get('/:storeId/product/:foodId', productController.getProductDetail);
router.post('/addStore', storeController.addStore);
router.put('/updateStore', storeController.updateStore);
router.delete('/deleteStore', storeController.deleteStore);
router.post('/changeSession', storeController.changeSession);

module.exports = router;
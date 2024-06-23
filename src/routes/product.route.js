/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', productController.getProducts);
router.put('/updateFood', upload.single('Image'), productController.updateProduct);
router.post('/addFood', upload.single('Image'), productController.addProduct);
router.delete('/deleteFood', productController.deleteProduct);

module.exports = router;
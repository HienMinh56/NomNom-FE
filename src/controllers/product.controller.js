/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

"use strict";


const foodApi = require('../api/product.api');
const storeApi = require('../api/store.api');

async function getProducts(req, res) {
  const { storeId } = req.params;
  const { cate } = req.query;

  const filters = {};
  if (cate !== undefined) filters.cate = cate;

  try {
    const storeData = await storeApi.getStores(filters);
    const productData = await foodApi.getProducts(storeId, filters);

    if (productData.error) {
      res.render('./pages/store_detail', { text: 'Store', products: [], store: null });
    } else {
      const store = storeData.stores.find(store => store.storeId === storeId);
      res.render('./pages/store_detail', { text: 'Store', products: productData.foods, store });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.render('./pages/store_detail', { text: 'Store', products: [], store: null });
  }
}

async function addProduct(req, res) {
  const { storeId } = req.query;
  const foodData = req.body;

  try {
    const result = await foodApi.addProduct(storeId, foodData);
    res.json(result);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'An error occurred while adding the product' });
  }
}

async function updateProduct(req, res) {
  const { foodId } = req.query;
  const foodData = req.body;

  try {
    const result = await foodApi.updateProduct(foodId, foodData);
    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
}

async function deleteProduct(req, res) {
  const { foodId } = req.body;

  try {
    const result = await foodApi.deleteProduct(foodId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
}

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
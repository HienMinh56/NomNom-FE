/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


/**
 * Node modules
 */
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


/**
 * Custom modules
 */
const { login } = require('./src/api/login.api');
const { tokenMiddleware } = require('./src/middlewares/auth.middleware');
const { config } = require('./src/config/config');
const { getUsers, addUser, updateUser, deleteUser } = require('./src/api/user.api');
const { getStores, addStore, updateStore, deleteStore } = require('./src/api/store.api');
const { getCampus } = require('./src/api/campus.api');
const { getAreas } = require('./src/api/area.api');


// Initial express app
const express = require('express');
const app = express();


/**
 * EJS setting
 */
app.set('view engine', 'ejs');


/**
 * Setting static directory
 */
app.use(express.static(`${__dirname}/public`));


/**
 * Enable cors & cookie parser
 */
app.use(cors()).use(cookieParser());
app.use(bodyParser.json());


/**
 * Encode post request body
 */
app.use(express.urlencoded({ extended: true }));


// Get current URL
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});


// Middleware
app.use(tokenMiddleware);
require('dotenv').config();


/*-----------------------------------*\
  #Login Route
\*-----------------------------------*/
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await login(username, password);

    console.log('Login API response:', result); // Debug log

    if (result.success) {
      // Check if the user role is equal to 1
      if (result.userInfo.Role == "1") {
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

        // Save the tokens into cookies
        // Generate access token with no specific expiration time (valid until the session ends)
        const accessToken = jwt.sign({ user: result.userInfo }, process.env.SECRET_KEY);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: result.userInfo.exp });
        res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, maxAge: oneWeek });
        res.redirect('/dashboard');
      } else {
        res.render('pages/login', { error: 'You do not have permission to access the dashboard' });
      }
    } else {
      res.render('pages/login', { error: result.message });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('pages/login', { error: 'An error occurred during login' });
  }
});


app.get('/login', (req, res) => {
  res.render('./pages/login');
});


/*-----------------------------------*\
  #Dashboard Route
\*-----------------------------------*/
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});


app.get('/dashboard', async (req, res) => {
  try {
    const storeData = await getStores();
    if (storeData.error) {
      res.render('pages/dashboard', { text: 'Dashboard', stores: [] });
    } else {
      res.render('pages/dashboard', { text: 'Dashboard', ...storeData });
    }
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.render('pages/dashboard', { text: 'Dashboard', stores: [] });
  }
});


/*-----------------------------------*\
  #User Route
\*-----------------------------------*/
app.get('/user', async (req, res) => {
  const { status, campusName } = req.query;

  // Create a filters object with only defined values
  const filters = {};
  if (status !== undefined) filters.status = status;
  if (campusName !== undefined) filters.campusName = campusName;

  try {
      const userData = await getUsers(filters);
      const campusData = await getCampus();

      if (userData.error || campusData.error) {
          res.render('pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [], campuses: [] });
      } else {
          res.render('pages/user', { text: 'User', ...userData, campuses: campusData.campuses });
      }
  } catch (error) {
      console.error('Error fetching users:', error);
      res.render('pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [], campuses: [] });
  }
});


app.post('/addUser', async (req, res) => {
  const userData = req.body;

  try {
    const result = await addUser(userData);
    res.json(result);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'An error occurred while adding the user' });
  }
});


app.put('/updateUser', async (req, res) => {
  const userId = req.query.userId;
  const userData = req.body;

  try {
    const result = await updateUser(userId, userData);
    res.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});


app.delete('/deleteUser', async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await deleteUser(userId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});


/*-----------------------------------*\
  #User Route
\*-----------------------------------*/
app.get('/store', async (req, res) => {
  const { status, areaName, sessionId } = req.query;

  // Create a filters object with only defined values
  const filters = {};
  if (status !== undefined) filters.status = status;
  if (areaName !== undefined) filters.areaName = areaName;
  if (sessionId !== undefined) filter.sessionId = sessionId;

  try {
      const storeData = await getStores();
      const areaData = await getAreas();

      if (storeData.error || areaData.error) {
          res.render('pages/store', { text: 'Store', stores: [], areas: [] });
      } else {
          res.render('pages/store', { text: 'Store', ...storeData, areas: areaData.areas });
      }
  } catch (error) {
      console.error('Error fetching stores:', error);
      res.render('pages/store', { text: 'Store', stores: [], areas: [] });
  }
});


// app.get(`/store/${storeId}`, async (req, res) => {
//   try {

//   } catch (error) {
//     console.error('Error fetching store:', error);
//     res.render('pages/storeDetail', { text: '', stores: [] })
//   }
// })


app.post('/addStore', async (req, res) => {
  const storeData = req.body;

  try {
    const result = await addStore(storeData);
    res.json(result);
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ error: 'An error occurred while adding the store' });
  }
});


app.put('/updateStore', async (req, res) => {
  const storeId = req.query.storeId;
  const storeData = req.body;

  try {
    const result = await updateStore(storeId, storeData);
    res.json(result);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});


app.delete('/deleteStore', async (req, res) => {
  const { storeId } = req.body;  // Đảm bảo là storeId

  try {
    const result = await deleteStore(storeId);
    res.json(result);
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ error: 'An error occurred while deleting the store' });
  }
});


// Add Authorization
// app.use(config);


/**
 * 404 page
 */
app.use((req, res) => {
    res.render('./pages/404');
});


app.listen(5000, () => {
    console.log(`Server is listening at http://localhost:5000`);
});
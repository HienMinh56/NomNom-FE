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
const { parseISO, differenceInMilliseconds } = require('date-fns');


/**
 * Custom modules
 */
const { login } = require('./src/api/login.api');
const { tokenMiddleware } = require('./src/middlewares/auth.middleware');
const { config } = require('./src/config/config');
const { getUsers, updateUser, deleteUser } = require('./src/api/user.api');
const { getStores, updateStore } = require('./src/api/store.api');


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

// 
require('dotenv').config();


// Login Function
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
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
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


// Login Page
app.get('/login', (req, res) => {
  res.render('./pages/login');
});


// Middleware
app.use(tokenMiddleware);


// Dashboard Page
app.get('/', (req, res) => {
  res.redirect('/dashboard');
});


app.get('/dashboard', async (req, res) => {
  try {
    const storeData = await getStores();
    if (storeData.error) {
      res.render('pages/dashboard', { text: 'Dashboard', stores: [] });
    } else {
      res.render('pages/dashboard', { text: 'Dashboard', stores: storeData });
    }
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.render('pages/dashboard', { text: 'Dashboard', stores: [] });
  }
});


// User Page
app.get('/user', async (req, res) => {
  try {
    const userData = await getUsers();
    if (userData.error) {
      res.render('pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [] });
    } else {
      res.render('pages/user', { text: 'User', ...userData });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('pages/user', { text: 'User', users: [], adminsAndShippers: [], customers: [] });
  }
});


// Xử lý route /updateUser
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


// Xử lý route /deleteUser
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


// Store Page
app.get('/store', async (req, res) => {
  try {
    const storeData = await getStores();
    if (storeData.error) {
      res.render('pages/store', { text: 'Store', stores: [] });
    } else {
      res.render('pages/store', { text: 'Store', stores: storeData });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('pages/store', { text: 'Store', stores: [] });
  }
});


// Xử lý route /updateStore
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


// Thêm axios interceptor để tự động thêm accessToken vào tất cả các yêu cầu
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
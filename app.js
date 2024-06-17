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
const { config } = require('./src/config/api.config');
const dashboardRoutes = require('./src/routes/dashboard.route');
const userRoutes = require('./src/routes/user.route');
const storeRoutes = require('./src/routes/store.route');


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
//app.use(tokenMiddleware);
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
        res.cookie('userInfo', result.userInfo, { httpOnly: true, secure: true, maxAge: result.userInfo.exp });
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
app.use('/dashboard', dashboardRoutes);


/*-----------------------------------*\
  #User Route
\*-----------------------------------*/
app.use('/user', userRoutes);


/*-----------------------------------*\
  #Store Route
\*-----------------------------------*/
app.use('/store', storeRoutes);


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
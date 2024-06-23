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


/**
 * Custom modules
 */
const loginRoute  = require('./src/routes/login.route');
const authenticatedUser = require('./src/middlewares/auth.middleware');
const authRoute = require('./src/routes/auth.route');
const logoutRoutes = require('./src/routes/logout.route');
const dashboardRoutes = require('./src/routes/dashboard.route');
const userRoutes = require('./src/routes/user.route');
const storeRoutes = require('./src/routes/store.route');
const productRoutes = require('./src/routes/product.route');
const orderRoutes = require('./src/routes/order.route');
const authManager = require('./src/config/auth.config');


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

// Get current User profile
app.use((req, res, next) => {
  const userInfo = authManager.getUserInfo();
  if (userInfo) {
    res.locals.userInfo = userInfo;
  }
  next();
});

require('dotenv').config();


/*-----------------------------------*\
  #Login Route
\*-----------------------------------*/
app.use('/login', loginRoute);


/*-----------------------------------*\
  #Auth Route
\*-----------------------------------*/
app.use('/auth', authRoute);


/**
 * Check user is authenticated
 */
app.use(authenticatedUser);


/*-----------------------------------*\
  #Logout Pages
\*-----------------------------------*/
app.use('/logout', logoutRoutes);


/*-----------------------------------*\
  #Dashboard Pages
\*-----------------------------------*/
app.use('/', dashboardRoutes);


/*-----------------------------------*\
  #User Pages
\*-----------------------------------*/
app.use('/user', userRoutes);


/*-----------------------------------*\
  #Store Pages
\*-----------------------------------*/
app.use('/store', storeRoutes);


/*-----------------------------------*\
  #Store Pages
\*-----------------------------------*/
app.use('/food', productRoutes);


/*-----------------------------------*\
  #Store Pages
\*-----------------------------------*/
app.use('/order', orderRoutes);


/*-----------------------------------*\
  #404 Pages
\*-----------------------------------*/
app.use((req, res) => {
    res.render('./pages/404');
});


app.listen(5000, () => {
    console.log(`Server is listening at http://localhost:5000`);
});
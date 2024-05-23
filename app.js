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


/**
 * Custom modules
 */
const login = require('./src/routes/login.route');
const authenticatedUser = require('./src/middlewares/auth_user.middleware');
const dashboard = require('./src/routes/dashboard.route');


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


/**
 * Encode post request body
 */
app.use(express.urlencoded({ extended: true }));


/**
 * Login page
 */
app.use('/login', login);


/**
 * Check user is authenticated
 */
app.use(authenticatedUser);


/**
 * Login page
 */
app.use('/dashboard', dashboard);


/**
 * 404 page
 */
app.use((req, res) => {
    res.render('./pages/404');
});


app.listen(5000, () => {
    console.log(`Server is listening at http://localhost:5000`);
});
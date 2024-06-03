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
const { parseISO, differenceInMilliseconds } = require('date-fns');


/**
 * Custom modules
 */
const { login } = require('./src/api/login.api');
const { tokenMiddleware } = require('./src/middlewares/auth.middleware');
const { getUsers } = require('./src/api/user.api');


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


app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});


app.get('/login', (req, res) => {
    res.render('./pages/login');
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await login(username, password);

    console.log('Login API response:', result); // Debug log

    if (result.success) {
      const now = new Date();
      
      // Manually set the accessToken expiry to 10 minutes from now
      const accessTokenExpiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now
      const accessTokenMaxAge = 10 * 60 * 1000; // 10 minutes in milliseconds

      const oneWeek = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

      // Save the tokens into cookies
      res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, secure: true, maxAge: oneWeek });
      res.redirect('/dashboard');
    } else {
      res.render('pages/login', { error: result.message });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.render('pages/login', { error: 'An error occurred during login' });
  }
});



app.use(tokenMiddleware);


app.get('/', (req, res) => {
  res.redirect('/dashboard');
});


app.get('/dashboard', (req, res) => {
  res.render('pages/dashboard', { text: 'Dashboard'});
});


app.get('/user', async (req, res) => {
  try {
    const userData = await getUsers();
    res.render('./pages/user', { text: 'User', ...userData});
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});


/**
 * 404 page
 */
app.use((req, res) => {
    res.render('./pages/404');
});


app.listen(5000, () => {
    console.log(`Server is listening at http://localhost:5000`);
});
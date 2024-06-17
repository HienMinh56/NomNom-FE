/**
 * @license Apache-2.0
 * @copyright Fancy 2024
 */

'use strict';


/**
 * Node modules
 */
require('dotenv').config();


const BASE_URL = process.env.BASE_URL;


const SECRET_KEY = process.env.SECRET_KEY;


module.exports = {
    BASE_URL,
    SECRET_KEY,
}
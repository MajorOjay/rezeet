const mysql = require('mysql');
require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,

    option: {
        host           : process.env.DB_HOST,
        user           : process.env.DB_USER,
        password       : process.env.DB_PASSWORD,
        database       : process.env.DB_NAME,
    },

    connection: mysql.createConnection({
        multipleStatements: true,
        host           : process.env.DB_HOST,
        user           : process.env.DB_USER,
        password       : process.env.DB_PASSWORD,
        database       : process.env.DB_NAME,
    }),

    pool: mysql.createPool({
        host           : process.env.DB_HOST,
        user           : process.env.DB_USER,
        password       : process.env.DB_PASSWORD,
        database       : process.env.DB_NAME,
    }),


}


	

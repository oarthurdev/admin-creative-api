const dotenv = require('dotenv').config();
const knex = require('knex');

const configurationJSON = {
    client: process.env.DB_CLIENT,
    connection: {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    useNullAsDefault: true
};

const connection = knex(configurationJSON);

module.exports = connection;
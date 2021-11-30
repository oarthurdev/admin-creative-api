const dotenv = require('dotenv').config();

module.exports = {
  development: {
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
  },
  production: {
    client: 'pg',
    connection: 'postgres://ggbjuckzqldsak:02fcc6e22ab7d0676170f08a9a1e0a6d820926e6966fbdc10a0da68ae9e104c5@ec2-54-164-22-242.compute-1.amazonaws.com:5432/dbh1n0diiu24lq',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    }
  }
};
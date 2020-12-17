require('dotenv').config()

module.exports = {
  "development": {
    "username": "isafbjli",
    "password": process.env.PW,
    "database": "isafbjli",
    "host": "suleiman.db.elephantsql.com",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "isafbjli",
    "password": process.env.PW,
    "database": "isafbjli",
    "host": "suleiman.db.elephantsql.com",
    "dialect": "postgres"
  }
}

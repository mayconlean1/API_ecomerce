const mysql = require ('mysql2/promise')

async function start (){
    return mysql.createPool({ // db
        "user": "dbuser",
        "password":  "123456",
        "database": "db",
        "host": "localhost",
        "port": 3306
    })
}

module.exports = start
   

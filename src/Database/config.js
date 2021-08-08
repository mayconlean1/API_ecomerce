const mysql = require ('mysql2/promise')

async function start (){
    return await mysql.createPool({ // db
        "user": process.env.MYSQL_USER || "test", // "dbuser"
        "password": process.env.MYSQL_PASSWORD || "123456",
        "database": process.env.MYSQL_DATABASE || "db_tests", // "db"
        "host": process.env.MYSQL_HOST || "localhost",
        "port": process.env.MYSQL_PORT || 3306
    })
}

module.exports = start


// const sqlite3 = require('sqLite3')
// const { open } = require('sqLite')

// module.exports = () => {
//     return open({
//         filename:'./database.sqlite',
//         driver: sqlite3.Database
//     });
    
// }
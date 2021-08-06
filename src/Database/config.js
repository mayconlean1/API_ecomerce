const mysql = require ('mysql2/promise')

async function start (){
    return await mysql.createPool({ // db
        "user": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "host": process.env.MYSQL_HOST,
        "port": process.env.MYSQL_PORT
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
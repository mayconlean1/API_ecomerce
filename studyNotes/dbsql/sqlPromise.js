const express = require('express')
const app = express()

const mysql = require ('mysql2/promise')

const start =async()=>{
    //pool
    const pool = await mysql.createPool({ // db
        "user": "dbuser",
        "password":  "123456",
        "database": "db",
        "host": "localhost",
        "port": 3306
        // "user": process.env.MYSQL_USER,
        // "password": process.env.MYSQL_PASSWORD,
        // "database": process.env.MYSQL_DATABASE,
        // "host": process.env.MYSQL_HOST,
        // "port": process.env.MYSQL_PORT
    })
    

    const conn = await pool.getConnection()
    .catch(err=>console.error(err))

    const [row] = await conn.query(`SELECT * FROM usuarios`)
    .catch(err=>console.error(err))

    console.log(row)

    await pool.end()
    .catch(err=>console.error(err))

    // app.listen(3000 , ()=>{console.log('Server build in port 3000')})

}
start()

// connection.connect(err =>{
//     if(err){
//         console.error('error conecting: ' + err.stack)
//     }
//     console.log('conected as id '+ connection.threadId)
// })

// connection.query(`SELECT * FROM users`,(err, rows, fields)=>{
//     if(!err){
//         console.log('resultados: ', rows)
        
//     }else{
//         console.error(err)
//     }
// })



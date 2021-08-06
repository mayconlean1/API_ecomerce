const mysql = require ('mysql2/promise')

async function connect(){
    return await mysql.createConnection({
        host: 'localhost',
        user: 'dbuser',
        password: '123456',
        database: 'db'
      });
}

async function select (){
    const conn = await connect()
    const [rows] = await conn.query(`SELECT * FROM usuarios`)
    console.log(rows)
    await conn.end()
}

console.log( select() )
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


// app.listen(3000 , ()=>{console.log('Server build in port 3000')})

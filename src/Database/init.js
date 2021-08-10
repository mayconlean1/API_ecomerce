// const Database = require('./configInit')
const Database = require('./config')
const db = process.env.MYSQL_DATABASE || 'db_tests'

const adminEmail = process.env.ADMIN_EMAIL || 'test_admin@email.com'
const adminPass = process.env.ADMIN_PASSWORD || '123456'
const {createHashPassword} = require ('../utils/utils')

const initDb = {
    async init (){
        const pool = await Database ()
        const conn = await pool.getConnection()
        .catch(err=>{ throw Error (err) })

        await conn.query(`
            CREATE TABLE IF NOT EXISTS ${db}.produtos(
                id INT NOT NULL AUTO_INCREMENT,
                nome TEXT NOT NULL,
                preco FLOAT NOT NULL,
                estoque INT NOT NULL,
                descricao TEXT DEFAULT NULL,
                imagens TEXT DEFAULT NULL,
                    PRIMARY KEY (id)
            );
        `)

        await conn.query(`
            CREATE TABLE IF NOT EXISTS ${db}.pedidos(
                id INT NOT NULL AUTO_INCREMENT,
                status VARCHAR(45) NULL DEFAULT 'aberto',
                cliente TEXT NOT NULL,
                contato TEXT NOT NULL,
                entrega TEXT NOT NULL,
                produtos TEXT NOT NULL,
                pagamento TEXT NOT NULL,
                valorTotal FLOAT NOT NULL,
                data_criacao TIMESTAMP NOT NULL,
                data_fechamento TIMESTAMP NULL DEFAULT NULL,
                    PRIMARY KEY (id)
            );
        `)
                
        await conn.query(`
            CREATE TABLE IF NOT EXISTS ${db}.usuarios (
                id INT NOT NULL AUTO_INCREMENT,
                email VARCHAR(220) NOT NULL,
                senha_hash VARCHAR(220) NOT NULL,
                tipo VARCHAR(220) DEFAULT 'usuario',
                    PRIMARY KEY (id),
                    UNIQUE INDEX email_UNIQUE (email ASC) 
            );
        `)

        const [adminUser] = await conn.query(`SELECT * FROM ${db}.usuarios WHERE id = 1`)
        const hashedPass = await createHashPassword(adminPass, 10)

        if(adminUser.length === 0){

            await conn.query(`INSERT INTO ${db}.usuarios(
                email, senha_hash, tipo
            )VALUES(
                '${adminEmail}', '${hashedPass}' , 'admin'
            );`)
            
        }else{
            await conn.query(`UPDATE ${db}.usuarios SET email = '${adminEmail}', senha_hash = '${hashedPass}', tipo = 'admin' WHERE id = 1;`)
        
        }
        await pool.end()
       
    },

    async dropAllTables(){
        const pool = await Database ()
        const conn = await pool.getConnection()
        .catch(err=>{ throw Error (err) })

        await conn.query(`DROP TABLE ${db}.usuarios;`)
        await conn.query(`DROP TABLE ${db}.pedidos;`)
        await conn.query(`DROP TABLE ${db}.produtos;`)
        await pool.end()
    },

    async drop(data={table:''}){
        const {table} = data

        const pool = await Database ()
        const conn = await pool.getConnection()
        .catch()

        await conn.query(`DROP TABLE ${db}.${table};`)
        await pool.end()
    },

}

initDb.init()

module.exports = initDb


// const Database = require('./config')

// const initDb = {
//     async init (){
//         const db = await Database()

//         await db.exec(`
//             CREATE TABLE IF NOT EXISTS produtos (
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 nome TEXT NOT NULL,
//                 preco INT NOT NULL,
//                 estoque INT NOT NULL,
//                 descricao TEXT DEFAULT '',
//                 imagens TEXT DEFAULT ''
//             );
//         `)

//         await db.exec(`
//             CREATE TABLE IF NOT EXISTS pedidos(
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 status TEXT DEFAULT "aberto",
//                 cliente TEXT NOT NULL,
//                 contato TEXT NOT NULL,
//                 entrega TEXT NOT NULL,
//                 produtos TEXT NOT NULL,
//                 pagamento TEXT NOT NULL,
//                 valorTotal INT NOT NULL,
//                 data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//                 data_fechamento TIMESTAMP DEFAULT NULL
//             );
//         `)

//         await db.exec(`
//             CREATE TABLE IF NOT EXISTS usuarios(
//                 id INTEGER PRIMARY KEY AUTOINCREMENT,
//                 email TEXT UNIQUE NOT NULL,
//                 senha_hash TEXT NOT NULL,
//                 tipo TEXT NOT NULL DEFAULT 'usuario'
//             );
//         `)       
//         await db.close()
//     }
// }

// initDb.init()

// module.exports = initDb

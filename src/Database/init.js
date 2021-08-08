// const Database = require('./configInit')
const Database = require('./config')
const db = process.env.MYSQL_DATABASE || 'db_tests'

const initDb = {
    async init (){
        const pool = await Database ()
        const conn = await pool.getConnection()
        .catch(err=>{ throw Error (err) })

        await conn.query(`
            CREATE TABLE IF NOT EXISTS ${db}.produtos(
                id INT NOT NULL AUTO_INCREMENT,
                nome TEXT NOT NULL,
                preco INT NOT NULL,
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
                valorTotal TEXT NOT NULL,
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
    }
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

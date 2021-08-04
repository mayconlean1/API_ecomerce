const Database = require('./config')

const initDb = {
    async init (){
        const db = await Database()

        await db.exec(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                preco INT NOT NULL,
                estoque INT NOT NULL,
                descricao TEXT DEFAULT '',
                imagens TEXT DEFAULT ''
            );
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS pedidos(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                status TEXT DEFAULT "aberto",
                cliente TEXT NOT NULL,
                contato TEXT NOT NULL,
                entrega TEXT NOT NULL,
                produtos TEXT NOT NULL,
                pagamento TEXT NOT NULL,
                valorTotal INT NOT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                data_fechamento TIMESTAMP DEFAULT NULL
            );
        `)

        await db.exec(`
            CREATE TABLE IF NOT EXISTS usuarios(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                senha_hash TEXT NOT NULL,
                tipo TEXT NOT NULL DEFAULT 'usuario'
            );
        `)
        
                     
        await db.close()
    }
}

initDb.init()

module.exports = initDb

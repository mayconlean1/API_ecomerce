const change = true
const throwError = false

const DBNAME = process.env.MYSQL_DATABASE || 'db_tests'

const Database = require ('../Database/config')
const { 
    mountWhere , 
    SQLFormat, 
    mountStringEqualAnd , 
    mountStringEqualComma, 
    mountWhereOR,
    mountStringEqualOr,
    parseDatabaseData,
    stringifyDatabaseData
} = require ('../utils/dbUtils')

const dbDo = {
    async get (data={table:'', where:{}, whereOR:{}} ){
        // data = {where :{}, ...data}
        const {table , where, whereOR} = data
        
        const pool = await Database ()
        const conn = await pool.getConnection()
        .catch(err=>{ throw Error (err) })

        let getData
        if(where){
            
            const [select] = await conn.query(`SELECT * FROM ${DBNAME}.${table} ${mountWhere(where) };`)
            .catch(err=>{ throw Error (err) })
            getData = select

        }else if(whereOR){

            const [select] = await conn.query(`SELECT * FROM ${DBNAME}.${table} ${mountWhereOR(whereOR) };`).catch(err=>{ throw Error (err) })
            getData = select

        }else {

            const [select] = await conn.query(`SELECT * FROM ${DBNAME}.${table};`)
            .catch(err=>{ throw Error (err) })
            getData = select

        }
        await pool.end()

        const dataDefault = parseDatabaseData(getData)

        return dataDefault
    },

    async insert(data = {table:'', insert:{}} ){
        if(throwError){throw Error('Dbdo insert throw error')}

        const {table , insert} = data
        const keys = Object.keys(insert)
        const values = Object.values( stringifyDatabaseData(insert) )

        const pool = await Database()
        const conn = await pool.getConnection()

        let info
        if(change){
            
            info = await conn.query(`
                INSERT INTO ${DBNAME}.${table}(
                    ${keys}
                )VALUES(
                    ${SQLFormat(values)}
                );
            `)

        }else{
            
            console.log(`
                INSERT INTO ${DBNAME}.${table}(
                    ${keys}
                )VALUES(
                    ${SQLFormat(values)}
                );
                
            `)
                
            console.log('change false : Database Insert')
        }

        await pool.end()
        // console.log(info)
        
        return  info ? info[0].insertId : false 
    },

    async update(data = {table : '' , update : {}, where : {} , whereOR: {} ,whereRequired:true}){
        if(throwError){throw Error('Dbdo update throw error')}
        data = {whereRequired:true , ...data}
        let {update} = data
        const {table , where ,whereRequired, whereOR } = data
        update = stringifyDatabaseData (update)

        const pool = await Database()
        const conn = await pool.getConnection()

        if(change){
            if (whereOR){
                // console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`)
    
                await conn.query(`UPDATE ${DBNAME}.${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`)
            }else{
                // console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`
                // )
    
                await conn.query(`UPDATE ${DBNAME}.${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)
            }
        }else{
            whereOR ? 
            console.log(`UPDATE ${DBNAME}.${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`) 
            :
            console.log(`UPDATE ${DBNAME}.${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)
            console.log('change desligado: Database update')
        }

        await pool.end()
    }, 

    async delete (data={table : '' , where : {},whereOR: {}, whereRequired:true }){
        if(throwError){throw Error('Dbdo delete throw error')}
        data = {whereRequired:true , ...data}
        const {table, where, whereRequired, whereOR} = data

        const pool = await Database()
        const conn = await pool.getConnection()

        if(change){
            if(whereOR){
                await conn.query(`
                    DELETE FROM ${DBNAME}.${table} 
                    ${whereRequired ? `
                        WHERE
                        ${mountStringEqualOr(whereOR)}
                    ` : ''} 
                `)
            }else{
                
                await conn.query(`
                    DELETE FROM ${DBNAME}.${table} 
                    ${whereRequired ? `
                        WHERE
                        ${mountStringEqualAnd(where)}
                    ` : ''} 
                `)
            }

        }else{
            whereOR?
            console.log(
                `DELETE FROM ${DBNAME}.${table} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}` : ''}` ) 
                :
            console.log(
                `DELETE FROM ${DBNAME}.${table} ${whereRequired ? ` WHERE ${mountStringEqualAnd(where)}` : ''}`
            )
        }

        await pool.end()
    },
}

module.exports = dbDo

// const dbDo = {
//     async get (data={table:'', where:{}, whereOR:{}} ){
//         // data = {where :{}, ...data}
//         const {table , where, whereOR} = data
//         const db = await Database()
//         let getData
//         if(where){
//             getData = await db.all(`SELECT * FROM ${table} ${mountWhere(where) }`)
//         }else if(whereOR){
//             getData = await db.all(`SELECT * FROM ${table} ${mountWhereOR(whereOR) }`)
//         }else {
//             getData = await db.all(`SELECT * FROM ${table}`)
//         }
//         await db.close()

//         const dataDefault = parseDatabaseData(getData)

//         return dataDefault
//     },

//     async insert(data = {table:'', insert:{}} ){
//         if(throwError){throw Error('Dbdo insert throw error')}

//         const {table , insert} = data
//         const keys = Object.keys(insert)
//         const values = Object.values( stringifyDatabaseData(insert) )

//         const db = await Database()

//         if(change){
//             await db.run(`
//                 INSERT INTO ${table}(
//                     ${keys}
//                 )VALUES(
//                     ${SQLFormat(values)}
//                 );
//             `)
    
//         }else{
            
//         console.log(`
//             INSERT INTO ${table}(
//                 ${keys}
//             )VALUES(
//                 ${SQLFormat(values)}
//             );
            
//         `)
            
//         console.log('change false : Database Insert')
//         }
//         await db.close()
        
//         let sqlite_sequence 
//         try {
//             sqlite_sequence = await this.get( {table: 'sqlite_sequence'})
//         } catch (error) {
//             throw Error(error)
//         }
//         const primaryKey = sqlite_sequence.reduce((seq,sql)=> {
//             if(sql.name === table){
//                 seq = sql.seq
//             }
//             return seq
//         },'')

//         return primaryKey
//     },

//     async update(data = {table : '' , update : {}, where : {} , whereOR: {} ,whereRequired:true}){
//         if(throwError){throw Error('Dbdo update throw error')}
//         data = {whereRequired:true , ...data}
//         let {update} = data
//         const {table , where ,whereRequired, whereOR } = data
//         update = stringifyDatabaseData (update)

        

//         const db = await Database()
//         if(change){
//             if (whereOR){
//                 // console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`)
    
//                 await db.run(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`)
//             }else{
//                 // console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`
//                 // )
    
//                 await db.run(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)
//             }
//         }else{
//             whereOR ? 
//             console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`) 
//             :
//             console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)


//             console.log('change desligado: Database update')
//         }

//         await db.close()
//     }, 

//     async delete (data={table : '' , where : {},whereOR: {}, whereRequired:true }){
//         if(throwError){throw Error('Dbdo delete throw error')}
//         data = {whereRequired:true , ...data}
//         const {table, where, whereRequired, whereOR} = data

//         const db = await Database()

//         if(change){
//             if(whereOR){
//                 await db.run(`
//                     DELETE FROM ${table} 
//                     ${whereRequired ? `
//                         WHERE
//                         ${mountStringEqualOr(whereOR)}
//                     ` : ''} 
//                 `)
//             }else{
                
//                 await db.run(`
//                     DELETE FROM ${table} 
//                     ${whereRequired ? `
//                         WHERE
//                         ${mountStringEqualAnd(where)}
//                     ` : ''} 
//                 `)
//             }

//         }else{
//             whereOR?
//             console.log(
//                 `DELETE FROM ${table} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}` : ''}` ) 
//                 :
//             console.log(
//                 `DELETE FROM ${table} ${whereRequired ? ` WHERE ${mountStringEqualAnd(where)}` : ''}`
//             )
//         }

//         await db.close()
//     },

//     async dropTable(data={table : ''}){
//         const {table} = data
//         const db = await Database()

//         await db.run(`DROP TABLE ${table}`)

//         await db.close()
//     },

//     alterTable (data = {table : ''}) {
//         const {table} = data
//         return {

//             async dropColumn( data={column : ''} ){
//                 const {column} = data 
//                 const getOneTable = await dbDo.get( {table : table} )
//                 const keys = Object.keys(getOneTable[0]).filter(key => key != column)
//                 const db = await Database()

//                 await db.run(`
//                     CREATE TABLE ${table}_temp AS SELECT ${keys} FROM ${table}
//                 `)
//                 await db.run(`
//                     DROP TABLE ${table}
//                 `)
//                 await db.run(`
//                     ALTER TABLE ${table}_temp
//                     RENAME TO ${table}
//                 `)

//                 await db.close()
//                 // Não teve como excluir a coluna por comando direto ,foi copiado a tabela filtrado a coluna que precisava deletar, excluida a tabela principal depois a temporaria foi renomeada com o nome da tabela excluida.
//                 // console.log(`
//                 //     STEP 1:
//                 //         CREATE TABLE ${table}_temp AS SELECT ${keys} FROM ${table}
//                 //     STEP 2:
//                 //         DROP TABLE ${table}
//                 //     STEP 3:
//                 //         ALTER TABLE ${table}_temp
//                 //         RENAME TO ${table}
//                 // `)
//             },

//             async addColumn(data = {newColumn:'' , config:''}){
//                 const {newColumn , config} = data
//                 const db = await Database()

//                 await db.run(`
//                     ALTER TABLE ${table}
//                     ADD COLUMN ${newColumn} ${config? config : 'TEXT'}
//                 `)
//                 await db.close()

//             },

//             async renameColumn(data= {column:'' , newColumn:'' }){
//                 const {column, newColumn} = data
//                 const db = await Database()

//                 await db.run(`
//                     ALTER TABLE ${table}
//                     RENAME COLUMN ${column} TO ${newColumn}
//                 `)
//                 await db.close()
//             }
//         }     
//     }
// }




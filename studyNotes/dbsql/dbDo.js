const Database = require ('./configInit')

const change = true
const throwError = false

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

            const [select] = await conn.query(`SELECT * FROM ${table} ${mountWhere(where) }`)
            .catch(err=>{ throw Error (err) })
            getData = select

        }else if(whereOR){

            const [select] = await conn.query(`SELECT * FROM ${table} ${mountWhereOR(whereOR) }`).catch(err=>{ throw Error (err) })
            getData = select

        }else {

            const [select] = await conn.query(`SELECT * FROM ${table}`)
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
                INSERT INTO ${table}(
                    ${keys}
                )VALUES(
                    ${SQLFormat(values)}
                );
            `)

        }else{
            
        console.log(`
            INSERT INTO ${table}(
                ${keys}
            )VALUES(
                ${SQLFormat(values)}
            );
            
        `)
            
        console.log('change false : Database Insert')
        }
        await pool.end()

        return info[0].insertId
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
    
                await conn.query(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`)
            }else{
                // console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`
                // )
    
                await conn.query(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)
            }
        }else{
            whereOR ? 
            console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}  ` : ''}`) 
            :
            console.log(`UPDATE ${table} SET ${mountStringEqualComma(update)}${whereRequired ? ` WHERE ${mountStringEqualAnd(where)} ` : ''}`)


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
                    DELETE FROM ${table} 
                    ${whereRequired ? `
                        WHERE
                        ${mountStringEqualOr(whereOR)}
                    ` : ''} 
                `)
            }else{
                
                await conn.query(`
                    DELETE FROM ${table} 
                    ${whereRequired ? `
                        WHERE
                        ${mountStringEqualAnd(where)}
                    ` : ''} 
                `)
            }

        }else{
            whereOR?
            console.log(
                `DELETE FROM ${table} ${whereRequired ? ` WHERE ${mountStringEqualOr(whereOR)}` : ''}` ) 
                :
            console.log(
                `DELETE FROM ${table} ${whereRequired ? ` WHERE ${mountStringEqualAnd(where)}` : ''}`
            )
        }

        await pool.end()
    },
}

module.exports = dbDo





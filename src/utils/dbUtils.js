const {isObject , isArray, dbParse, typeJSON} = require ('./utils')

function SQLFormat(elements = []){
    return elements.map(e =>{
        if (typeof(e) === 'string'){
            return '"' + e + '"'
        }else if (typeof(e) === 'number'){
            return String(e) 
        }else{ 
            if (isObject(e) || isArray(e)){
                return JSON.stringify(e).replace(/"/gi, "'") 
            }           
            throw Error('formato inválido')
        }
    })
}

function mountStringEqualAnd(object={}){
    const keys = Object.keys(object)
    const values = SQLFormat( Object.values(object) )
    let string = ''
    const len = keys.length
    for (let index = 0 ; index < len ; index++){
        string += `${keys[index]} = ${values[index]}`
        string += index < len -1 ? ' AND ' : ''
    }
    return string
}

function mountStringEqualComma(object={}){
    const keys = Object.keys(object)
    const values = SQLFormat( Object.values(object) )
    let string = ''
    const len = keys.length
    for (let index = 0 ; index < len ; index++){
        string += `${keys[index]} = ${values[index]}`
        string += index < len -1 ? ' , ' : ''
    }
    return string
}

function mountWhere(where){
    let command = ''

    if(isObject(where)){
        const keys = Object.keys(where)
        const values = SQLFormat( Object.values(where) )

        if(keys.length === 1){
            command += ` WHERE ${keys[0]} = ${values[0]} `

        }else if(keys.length > 1){
            
            command += ` WHERE ${mountStringEqualAnd(where)}`
        }
    }else{
        command += `  WHERE `
    }
    
    return command
}

function mountStringEqualOr(whereOR){

    const keys = Object.keys(whereOR)
    const values = Object.values(whereOR)
    const kLen = keys.length -1

    return values.map( (element, index) => {

        const key = keys[index]
        let command = ''
        
        if (isArray(element)){
            
            const eLen = element.length -1
            
            command += element.map( (value , i) => {
                return `${key} = ${value}${i < eLen? ' OR ' : ''}` 
            }).join('')

        }else if (typeof(element) === 'string'){
            
            command += `${key} = "${element}"`
        }else if (typeof(element) === 'number'){
            
            command += `${key} = ${element}`
        }  
        command += `${index < kLen ?' OR ':''}`
        return command 

    }).join('')
}

function mountWhereOR(whereOR){
    let command = ''

    if(isObject(whereOR)){
        command += ` WHERE ${mountStringEqualOr(whereOR)} `

    }else{
        command += ` WHERE`
    }

    return command
}

function parseDatabaseData(dbData=[]){
    return dbData.map(data =>{
        const dataKeys = Object.keys(data)
        const dataValues = Object.values(data)
        const parsedValues = dataValues.map(data=> {
            if(typeJSON(data) === 'object'){
                data = dbParse(data) ? dbParse(data) : data
            }
            return data
        })
        const parsedData = dataKeys.reduce( (obj,key,index)=>{
            const data =  parsedValues[index]

            // console.log(typeJSON(data), data)

            if(typeJSON(data) === 'db_object' || typeJSON(data) === 'db_array'){
                obj[key] = dbParse(data) ? dbParse(data) : data
               
               return obj
            }else{
                obj[key] = data
                return obj
            }
        },{} )

        return parsedData
    })
}

function stringifyDatabaseData(dbDataValues={}){
    const keys = Object.keys(dbDataValues)
    const values = Object.values(dbDataValues)

    const defaultData = keys.reduce((OBJ_RETURN, key , index) =>{
        OBJ_RETURN[key] = typeof (values[index]) === 'object'? JSON.stringify(values[index]).replace(/"/gi , "'") :values[index] 
       return OBJ_RETURN
    },{})
    
    return defaultData
}

module.exports = {
    mountStringEqualAnd, 
    mountStringEqualComma,
    mountWhere, 
    SQLFormat, 
    mountWhereOR,
    mountStringEqualOr,
    parseDatabaseData,
    stringifyDatabaseData
}
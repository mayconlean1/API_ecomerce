const bcrypt = require ('bcrypt')

function isObject (element){

    let elemmentIs = false
    try{
        element.forEach(v =>{})
    }catch{
        if (typeof(element) === 'object'){
            elemmentIs = true
        }
    }

    return elemmentIs
}

function isArray(element){
    let elemmentIs = false

    try {
        element.forEach(v =>{})
        elemmentIs = true
    } catch  {}

    return elemmentIs
}

function isNumber(element){
    return Number(element) || Number(element) === 0 ? true : false
}

function dbParse(element , replace = true){
    try { // verifica se o conteudo de produtos não é uma string
        if(replace){
            element = element.replace(/'/gi, '"')
        }
        element = JSON.parse(element)
    } catch { return false}
    return element
}

function dbStringify(element , replace= true){
    try {
        element = JSON.stringify(element)
        if(replace){
            element = element.replace(/"/gi, "'")
        }
    } catch { return false}
    return element
}

function typeJSON (element){
    const parsedElement = dbParse(element)
    let elemmentIs = ''

    // console.log('TESTE',typeof(element), element, parsedElement)
    if(parsedElement){
        if(isObject(parsedElement)){
            elemmentIs = 'db_object'
        }else if (isArray(parsedElement)){
            elemmentIs = 'db_array'
        }else if (isNumber(parsedElement)){
            elemmentIs = 'db_number'
        }
    }
    else{
        if(isObject(element)){
            elemmentIs = 'object'
        }else if (isArray(element)){
            elemmentIs = 'array'
        }else if (isNumber(element)){
            elemmentIs = 'number'
        }else{
            elemmentIs = 'string'
        }
    }
    return elemmentIs
}

function UTCDateDatabase (dateValue = ''){

    const date = dateValue === ''? new Date () : new Date (dateValue)
    const year = '0000'+ date.getUTCFullYear()
    const y = year.slice(-4)
    const mounth = '00'+ date.getUTCMonth()
    const m = mounth.slice(-2)
    const day = '00'+ date.getUTCDate()
    const d = day.slice(-2)

    const hour ='00'+ date.getUTCHours()
    const hr = hour.slice(-2)
    const min = '00'+date.getUTCMinutes()
    const mn = min.slice(-2)
    const sec = '00'+ date.getUTCSeconds()
    const sc = sec.slice(-2)

    const fullDate = [y,m,d].join('-')
    const fullHour = [hr,mn,sc].join(':')

    return `${fullDate} ${fullHour}`

}

function createHashPassword (password, salt){
    return new Promise((resolve , reject)=>{
        bcrypt.hash(password, salt ,(err, hash)=>{
            if(err){reject(err)}
            resolve(hash)
        })
    })
}

function comparePassword(password, createHashPassword){
    return new Promise((resolve , reject)=>{
        bcrypt.compare(password, createHashPassword ,(err, hash)=>{
            if(err){reject(err)}
            resolve(hash)
        })
    })
}

function indexRandomArray(array=[]){
    function isArray(element){
        let elemmentIs = false
    
        try {
            element.forEach(v =>{})
            elemmentIs = true
        } catch  {}
    
        return elemmentIs
    }
    if(isArray(array)){
        return Math.floor( Math.random()* array.length)
    }
    return false
}

function evalute(awaitString){
    return new Promise((resolve , reject)=> resolve(eval(awaitString)))
}

basePath = __dirname.replace(/src.*/, '')

module.exports = {
    isObject , 
    isArray, 
    isNumber, 
    dbParse, 
    typeJSON, 
    dbStringify,
    basePath,
    UTCDateDatabase,
    createHashPassword,
    comparePassword,
    indexRandomArray,
    evalute
}
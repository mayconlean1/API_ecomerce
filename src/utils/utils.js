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

basePath = __dirname.replace(/src.*/, '')

module.exports = {
    isObject , 
    isArray, 
    isNumber, 
    dbParse, 
    typeJSON, 
    dbStringify,
    basePath
}
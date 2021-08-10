const utils = require('../src/utils/utils')

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

const array = [1 , 2 , 3 , 4]

console.log( Math.floor( Math.random()* array.length ) )
console.log(utils.indexRandomArray(array) )
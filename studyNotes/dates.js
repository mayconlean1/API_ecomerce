// Receber data UTC
const dbDate = '   2021-07-22 02:50:27   '
    .replace(/^\s+/gi,'') //retira espaços vazios do começo
    .replace(/\s+$/gi,'') // retirar espaços vazios do final
    .replace(/[- :]/gi,',') // substitui caracteres  ['' , -, :]
    .split(',') // transforma em um array separado pela virgula
    .map(char => Number(char)) //transfoma os elementos em numero

const date =eval( `new Date(Date.UTC(${dbDate}) )` )
console.log(date.toUTCString())
console.log(date.toString())
console.log(date.toISOString())

// UTC para hora local
const dateUTC = new Date( 1627496010693)
console.log(dateUTC.toString())
// console.log(dateUTC.getTimezoneOffset()/ 60)
// console.log(dateUTC.setHours(- dateUTC.getTimezoneOffset()/60))
// console.log(dateUTC.getHours() , dateUTC.getMinutes())


//hora local para UTC

// const date = new Date()
// date.setHours( + date.getTimezoneOffset() /60 )
// console.log(date.getHours() , date.getMinutes())

//Valores para armazenar data
// console.log(Date.now())
// console.log(date.valueOf())

//Chamando a data com os valores criados
// const date3 = new Date(1626933026820)
// console.log(date3.getHours() , date3.getMinutes())


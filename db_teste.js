const db = require ('./src/model/dbDo')

// db.get( {table: 'teste'} ).then(get => console.log(get)) 

// db.delete({table: 'teste', where : {id:6, name: 'Jose'}})

// db.insert( {table: 'produtos' , insert : {nome : 'video-game' , preco: 5709.90, estoque : 10}})

// const array = {big:'um.jpg' , small:'dois.jpg'}
// const img = JSON.stringify(array).replace(/"/gi , `'`)

// db.update({
//     table:'produtos',
//     update : {
//         imagens : img
//     } ,
//     where:{
//         nome : 'video-game'
//     }   
// })

// db.get({table:'produtos', where:{nome:'video-game'}})
// .then(p => {
//     const {imagens} = p[0]
//     const replacedImg = imagens.replace(/'/gi , '"')
//     const img = JSON.parse(replacedImg)
    
//     console.log(  img )

// })

// db.dropTable( {table:'produtos'} )
 
// db.get({table:'produtos', whereOR :{ id:[3] } } ).then(r =>{
//     console.log(r[0] , 'Test get')
// })

// db.get({table:'pedidos'} ).then(r =>{
//     console.log(r , 'Test get')
// })

db.get({table:'sqlite_sequence'} ).then(r =>{
    console.log(r , 'Test get')
})


// db.alterTable( {table:'produtos'} ).dropColumn( {column:'teste' } )

// db.alterTable( {table:'produtos'} ).addColumn( {newColumn:'teste' , config:'INT DEFAULT 1'} )

// db.alterTable( {table:'produtos'} ).renameColumn({column:'teste', newColumn:'codigo'})

// console.log(process.env.DATABASE_ID)

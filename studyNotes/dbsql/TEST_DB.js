const db = require('./dbDo')

// db.get({table:'usuarios', where: {tipo : 'admin'}}).then(data =>{
//     console.log(data)
// })

// db.insert({table : 'usuarios' , insert:{email : 'teste5@email', senha_hash:'111111--'}})
// .then(info =>{ console.log(info) } )

// db.update({table: 'usuarios', update:{tipo:'admin'},where:{id:3} })

db.delete({table: 'usuarios' , where:{id:6}})
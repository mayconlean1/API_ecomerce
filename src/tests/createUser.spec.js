const app = require ('../app')
const request = require ('supertest')
const Database = require ('../Database/init')

describe('Criar usuario', ()=>{

    beforeAll(async()=>{
        await Database.dropAllTables()
        await Database.init()
    },30000) // settimeout 30000

    it('Deve ser possivel criar um usuario' ,async ()=>{

        const data =  {
            email : 'teste@email.com',
            senha : '123456'
        }

        const req = await request (app)
            .post('/usuarios/cadastro')
            .send(data)
        
        expect(req.status).toEqual(201);
    })

})

//expect('object').toHaveProperty('id')
//beforeAll( ()=>{ const variavel = ''} )
//expects().rejects.toEqual()

//npm supertest   simula as rotas
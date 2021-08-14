const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const {createNewUser, login} = require ('../../utils/utilsTest')

module.exports= (data = {singleTest:false})=>{
    data = {singleTest:false, ...data}
    const {singleTest} = data
    
    let userData 

    return describe('Criar usuario', ()=>{
        beforeAll(async()=>{
            if (singleTest){
                envConfig()
                try { await Database.drop({table: 'usuarios'}) } catch  {}
                await Database.init()
            }
            
        }) // settimeout 30000
    
        it('Deve ser possivel criar um usuario' ,async ()=>{
            const [req, data] = await createNewUser()
            userData = {...data}
            expect(req.status).toBe(201);
        })
    
        it ('Não deve ser possível criar um usuario com email repetido',async ()=>{
            const req = await request (app)
                .post('/usuarios/cadastro')
                .send(userData)
            
            expect(req.status).toEqual(500);
        })
    
        it('Deve ser possivel criar um usuario admin logado como admin', async()=>{
            const [req] = await createNewUser('admin')
            expect(req.status).toBe(201)
        })

        it('Não deve ser possivel criar um usuario admin logado como usuario', async()=>{
            const [,dataUser] = await createNewUser()
            expect(dataUser.tipo).toBe('usuario')
        })
    
    })
}

//expect('object').toHaveProperty('id')
//beforeAll( ()=>{ const variavel = ''} )
//expect().rejects.toEqual()

//npm i supertest   simula as rotas
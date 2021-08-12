const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const db = require ('../../../model/dbDo')
const envConfig = require ('../../_envConfig')

const faker = require ('faker')
faker.locale = 'pt_BR'

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    const fakeEmail = faker.internet.email()
    const fakeSenha = faker.internet.password()

    return describe('Criar usuario', ()=>{
    
        beforeAll(async()=>{
            if (singleTest){
                envConfig()
                await Database.init()
                // await Database.drop({table: 'usuarios'})
                // await Database.init()
            }
            
        }) // settimeout 30000
    
        it('Deve ser possivel criar um usuario' ,async ()=>{
            const data =  {
                email : fakeEmail,
                senha : fakeSenha
            }
            const req = await request (app)
                .post('/usuarios/cadastro')
                .send(data)
            
            expect(req.status).toEqual(201);
        })
    
        it ('Não deve ser possível criar um usuario com email repetido',async ()=>{
            const data =  {
                email : fakeEmail,
                senha : fakeSenha
            }
    
            const req = await request (app)
                .post('/usuarios/cadastro')
                .send(data)
            
            expect(req.status).toEqual(500);
        })
    
        it('Deve ser possivel criar um usuario admin logado como admin', async()=>{

            const adminDatalogin =  {
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            }

            const reqLogin = await request (app)
                .post('/usuarios/login')
                .send(adminDatalogin)

            const token = reqLogin.body.token

            const createData =  {
                email : faker.internet.email(),
                senha : faker.internet.password(),
                tipo : 'admin'
            }

            const reqCreate = await request (app)
                .post('/usuarios/cadastro')
                .set('auth', `Bearer ${token}`)
                .send(createData)
                
            //reqCreate.request.header
            
            expect(reqLogin.status).toBe(200)
            expect(reqCreate.status).toBe(201)
        })

        it('Não deve ser possivel criar um usuario admin logado como usuario', async()=>{

            const userDatalogin =  {
                email : fakeEmail,
                senha : fakeSenha
            }

            const reqLogin = await request (app)
                .post('/usuarios/login')
                .send(userDatalogin)

            const token = reqLogin.body.token

            const createData =  {
                email : faker.internet.email('admin'),
                senha : faker.internet.password(),
                tipo : 'admin'
            }

            const reqCreate = await request (app)
                .post('/usuarios/cadastro')
                .set('auth', `Bearer ${token}`)
                .send(createData)
                
            //reqCreate.request.header
            
            const [user] = await db.get({table:'usuarios', where:{email:createData.email}})

            // console.log(user)

            expect(reqLogin.status).toBe(200)
            expect(user.tipo).toBe('usuario')
        })
    
    })
}

//expect('object').toHaveProperty('id')
//beforeAll( ()=>{ const variavel = ''} )
//expect().rejects.toEqual()

//npm i supertest   simula as rotas
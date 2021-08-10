const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const faker = require ('faker')
faker.locale = 'pt_BR'

const userTestData =  {
    email : faker.internet.email(),
    senha : faker.internet.password()
}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data
    return describe('Logar usuario',()=>{

        beforeAll(async()=>{

            if(singleTest){
                
                envConfig()
    
                await Database.init()
                // await Database.drop({table: 'usuarios'})
                // await Database.init()
            }
    
            await request (app)
                .post('/usuarios/cadastro')
                .send(userTestData)
        })
        
        it('não deve logar com email errado',async()=>{
            const data =  {
                email : 'teste1@emailErrado.com',
                senha : userTestData.senha
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)

            expect(req.status).toBe(401)
        })

        it('nao deve logar com a senha errada',async()=>{
            const data =  {
                email : userTestData.email,
                senha : 'senha errada'
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)


            expect(req.status).toBe(401)
        })

        it('deve logar como usuario',async()=>{

            const req = await request (app)
                .post('/usuarios/login')
                .send(userTestData)

            expect(req.status).toBe(200)
        })
        
        it('deve logar como admin', async()=>{
            const data =  {
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)

            expect(req.status).toBe(200)
        })
    })
}



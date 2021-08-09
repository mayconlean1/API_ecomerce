const app = require ('../app')
const request = require ('supertest')
const Database = require ('../Database/init')

module.exports= ()=>{
    return describe('Logar usuario',()=>{
        beforeAll(async()=>{
            process.env.JWT_SECRET = 'SECRET'
            process.env.ADMIN_EMAIL = 'test_admin@email.com'
            process.env.ADMIN_PASSWORD = '123456'

            await Database.init()
            await Database.drop({table: 'usuarios'})
            await Database.init()
    
            const data =  {
                email : 'teste1@email.com',
                senha : '123456'
            }
    
            await request (app)
                .post('/usuarios/cadastro')
                .send(data)
        })
        
        it('não deve logar com email errado',async()=>{
            const data =  {
                email : 'teste1@emailErrado.com',
                senha : '123456'
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)

            expect(req.status).toBe(401)
        })

        it('nao deve logar com a senha errada',async()=>{
            const data =  {
                email : 'teste1@email.com',
                senha : 'senha errada'
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)


            expect(req.status).toBe(401)
        })

        it('deve logar como usuario',async()=>{

            const data =  {
                email : 'teste1@email.com',
                senha : '123456'
            }

            const req = await request (app)
                .post('/usuarios/login')
                .send(data)

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



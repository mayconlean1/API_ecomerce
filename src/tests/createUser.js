const app = require ('../app')
const request = require ('supertest')
const Database = require ('../Database/init')
const db = require ('../model/dbDo')

module.exports = ()=>{
    return describe('Criar usuario', ()=>{
    
        beforeAll(async()=>{
            process.env.JWT_SECRET = 'SECRET'
            process.env.ADMIN_EMAIL = 'test_admin@email.com'
            process.env.ADMIN_PASSWORD = '123456'
            process.env.MYSQL_DATABASE = 'db_tests'

            await Database.init()
            await Database.drop({table: 'usuarios'})
            await Database.init()
            
        }) // settimeout 30000
    
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
    
        it ('Não deve ser possível criar um usuario com email repetido',async ()=>{
            const data =  {
                email : 'teste@email.com',
                senha : '123456'
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
                email : 'admin1@email.com',
                senha : '123456',
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
                email : 'teste@email.com',
                senha : '123456'
            }

            const reqLogin = await request (app)
                .post('/usuarios/login')
                .send(userDatalogin)

            const token = reqLogin.body.token

            const createData =  {
                email : 'admin2@email.com',
                senha : '123456',
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
//expects().rejects.toEqual()

//npm supertest   simula as rotas
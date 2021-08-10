const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const faker = require ('faker')
faker.locale = 'pt_BR'

const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const testAdmin ={
    data:{
        email : 'admin_'+faker.internet.email(),
        senha : faker.internet.password(),
        tipo : 'admin'
    },
}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Criar produto',()=>{

        beforeAll(async()=>{

            if(singleTest){
                envConfig()
                Database.init()
            }
            
            await request (app)
                .post('/usuarios/cadastro')
                .send(testUser.data)

            const reqUser = await request (app)
                .post('/usuarios/login')
                .send(testUser.data)
            testUser.token = reqUser.body.token

            const reqAdminLogin = await request (app)
                .post('/usuarios/login')
                .send({
                    email : process.env.ADMIN_EMAIL,
                    senha : process.env.ADMIN_PASSWORD
                })

            await request (app)
                .post('/usuarios/cadastro')
                .set('auth' , `Bearer ${reqAdminLogin.body.token}`)
                .send(testAdmin.data)

            const reqAdmin = await request (app)
                .post('/usuarios/login')
                .send(testAdmin.data)
            testAdmin.token = reqAdmin.body.token
        })

        it('Não deve ser possivel adicionar um produto como usuario',async ()=>{
            const dataProduct = {
                name: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }   

            const req = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${testUser.token}`)
                .send(dataProduct)

            expect(req.status).toBe(401)
        })

        it('Deve ser possivel adicionar um produto como admin',async ()=>{
            const dataProduct = {
                nome: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }   

            const req = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${testAdmin.token}`)
                .send(dataProduct)

            expect(req.status).toBe(201)
        })

        it('Não deve ser possivel adicionar um produto, com as chaves erradas',async ()=>{
            const dataProduct = {
                nome_chave_errada: faker.commerce.productName(),
                preco_chave_errada: faker.commerce.price(),
                estoque_chave_errada : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }   

            const req = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${testAdmin.token}`)
                .send(dataProduct)

            console.log(req.body)
            expect(req.status).toBe(500)
        })
    })

}
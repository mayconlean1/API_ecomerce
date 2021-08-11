const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const faker = require ('faker')
faker.locale = 'pt_BR'

let tokenAdmin
const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}
let keyProduct 

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Atualizar dados do produto',()=>{
        beforeAll(async()=>{
            if(singleTest){
                envConfig()
                Database.init()
            }
            //criar usuario
            await request (app)
                .post('/usuarios/cadastro')
                .send(testUser.data)

            const reqUser = await request (app)
                .post('/usuarios/login')
                .send(testUser.data)
            testUser.token = reqUser.body.token
            // 
            //logar admin
            const reqAdminLogin = await request (app)
                .post('/usuarios/login')
                .send({
                    email : process.env.ADMIN_EMAIL,
                    senha : process.env.ADMIN_PASSWORD
                })
            tokenAdmin = reqAdminLogin.body.token

            //criar produto
            const dataProduct = {
                nome: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }   

            const reqProduto = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${tokenAdmin}`)
                .send(dataProduct)
            keyProduct = reqProduto.body.chave
        })

        it('Não deve atualizar o produto com token de usuario', async()=>{
            const dataProduct = {
                id: keyProduct,
                nome: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }

            const req = await request (app)
                .patch('/produtos')
                .set('auth',`Bearer ${testUser.token}`)
                .send(dataProduct)

            expect(req.status).toBe(401)
        })

        it('Não deve atualizar o produto sem o id do produto', async()=>{
            const dataProduct = {
                nome: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }

            const req = await request (app)
                .patch('/produtos')
                .set('auth',`Bearer ${tokenAdmin}`)
                .send(dataProduct)

            expect(req.status).toBe(304)
        })

        it('Deve atualizar o produto logado como admin', async()=>{
            const dataProduct = {
                id: keyProduct,
                nome: faker.commerce.productName(),
                preco: faker.commerce.price(),
                estoque : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }

            const req = await request (app)
                .patch('/produtos')
                .set('auth',`Bearer ${tokenAdmin}`)
                .send(dataProduct)

            expect(req.status).toBe(200)
        })
        
    })

}
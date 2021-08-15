const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')
const {indexRandomArray} = require ('../../../utils/utils')

const faker = require ('faker')
faker.locale = 'pt_BR'

const 
    {createNewUser, 
    login,
    createNewProduct,
    postProduct
} = require ('../../utils/utilsTest')

let tokenAdmin
const idProducts = []

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Criar produto',()=>{

        beforeAll(async()=>{

            if(singleTest){
                envConfig()
                try { 
                    await Database.drop({table: 'usuarios'}) 
                    await Database.drop({table: 'produtos'}) 
                } catch  {}
                await Database.init()
            }

            const reqAdminLogin = await request (app)
                .post('/usuarios/login')
                .send({
                    email : process.env.ADMIN_EMAIL,
                    senha : process.env.ADMIN_PASSWORD
                })
            tokenAdmin = reqAdminLogin.body.token

            for (let c = 0; c < 3; c++){
                const preco = (Number( faker.commerce.price()) + Math.random()).toFixed(2)
                const dataProduct = {
                    nome: faker.commerce.productName(),
                    preco ,
                    estoque : Math.trunc( faker.finance.amount() ),
                    descricao : faker.commerce.productDescription()
                }   
    
                const req = await request (app)
                    .post('/produtos')
                    .set('auth',`Bearer ${tokenAdmin}`)
                    .send(dataProduct)
                idProducts.push(req.body.chave)
            }
        })

        it ('Deve retornar um JSON de todos os produtos do banco de dados',async()=>{
            const req = await request (app)
                .get('/produtos')
            expect(req.status).toBe(200)

        })

        it('Deve retornar um JSON de um produto especifico', async()=>{

            const randomIndex = indexRandomArray(idProducts)
            const idProduct = idProducts[randomIndex]
            const req = await request (app)
                .get(`/produtos/${idProduct}`)

            expect(req.status).toBe(200)
            
        })

        it('Deve retornar "not found" quando um produto não existe', async()=>{
            const req = await request (app)
                .get(`/produtos/naoExiste`)

            expect(req.status).toBe(404)
        })

    })

}
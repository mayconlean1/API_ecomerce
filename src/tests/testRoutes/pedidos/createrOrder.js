const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const {createProduct, randomNumber, UTCDateDatabase} = require ('./utils')

const faker = require ('faker')
faker.locale = 'pt_BR'

const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const products = []

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
            tokenAdmin = reqAdminLogin.body.token

            const random  = randomNumber(2)
            const quantProducts = random === 0 ? 1: random
            for(let cont=0 ; cont < quantProducts ;cont++){
                products.push( await createProduct(tokenAdmin) )
            }
        })
        // /pedidos
        it('Não deve criar o pedido se não estiver logado', async()=>{
            const quantItens = randomNumber(products.length)
            const dbProducts = {total:0}
            for (let i=0; i < quantItens; i++){
                const indexProducts = randomNumber(products.lenght)
                const product = products[indexProducts]

                const quantOrder =randomNumber(Math.round( product.estoque/2 ) ) 
                dbProducts.total = (product.preco * quantOrder) + dbProducts.total
                dbProducts[product.id] = {}
                dbProducts[product.id].nome = product.nome
                dbProducts[product.id].valor_unitario = product.preco
                dbProducts[product.id].quantidade = quantOrder
    
            }
            const {total , ...dbProduct} = dbProducts
            const dataOrder = {
                cliente : faker.name.findName,
                contato : testUser.data.email,
                entrega : faker.address.streetAddress,
                produtos : dbProduct,
                pagamento : randomNumber(1) ===0? 'dinheiro':'cartao'   ,
                valorTotal : total,
                data_criacao : UTCDateDatabase()
            }

            const req = await request (app)
                .post('/pedidos')
                .send(dataOrder)
            expect(req.status).toBe(401)
        })
        // it()
    })

}



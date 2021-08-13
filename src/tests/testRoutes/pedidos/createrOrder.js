
//esse teste não está fechando sozinho após o término

const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const {createProduct, randomNumber, createDataOrder} = require ('./utils')

const faker = require ('faker')
faker.locale = 'pt_BR'


const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const products = []
let tokenAdmin

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Cria um pedido',()=>{
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

            const random  =  randomNumber(4) 
            const quantProducts = random === 0 ? 1: random
            for(let cont=0 ; cont < quantProducts ;cont++){
                products.push( await createProduct(tokenAdmin) )
            }
        })
        // /pedidos
        it('Não deve criar o pedido se não estiver um Token', async()=>{
            
            const dataOrder = createDataOrder(testUser, products)

            const req = await request (app)
                .post('/pedidos')
                .send(dataOrder)

            expect(req.status).toBe(401)
        })

        it('Não deve criar o pedido se o campo produtos não for um objeto', async()=>{
            
            const dataOrder = createDataOrder(testUser, products)
            dataOrder.produtos = 'formato inválido'

            const req = await request (app)
                .post('/pedidos')
                .set ('auth',`Bearer ${testUser.token}`)
                .send(dataOrder)

            expect(req.status).toBe(500)
            expect(req.body.erro).toEqual('Formato campo produto inválido')
        })

        it('Não deve criar o pedido se algum produto não existir', async()=>{
            const dataOrder = createDataOrder(testUser, products)
            dataOrder.produtos = {'notExists': 1}
           
            const req = await request (app)
                .post('/pedidos')
                .set ('auth',`Bearer ${testUser.token}`)
                .send(dataOrder)

            dataOrder.produtos = {999: 1}
           
            const req2 = await request (app)
                .post('/pedidos')
                .set ('auth',`Bearer ${testUser.token}`)
                .send(dataOrder)
                
            expect(req.status).toBe(500)
            expect(req.body.mensagem).toEqual('Não existe produtos')
            expect(req2.status).toBe(500)
            expect(req2.body.mensagem).toEqual('Não existe produtos')
        })

        it('Não deve criar o pedido se algum produto não ter estoque suficiente', async()=>{
            
            const noStockProduct = await createProduct(tokenAdmin, estoque = false)
            products.push(noStockProduct)

            const dataOrder = createDataOrder(testUser, products)
           
            const req = await request (app)
                .post('/pedidos')
                .set ('auth',`Bearer ${testUser.token}`)
                .send(dataOrder)

            products.pop()

            expect(req.status).toBe(500)
            expect(req.body.mensagem).toEqual('Produto(s) sem estoque')
            
        })

        it('Deve criar o pedido com o Token válido', async()=>{   

            const dataOrder = createDataOrder(testUser, products)

            const req = await request (app)
                .post('/pedidos')
                .set ('auth',`Bearer ${testUser.token}`)
                .send(dataOrder)

            expect(req.status).toBe(201)
        })  
    })
}



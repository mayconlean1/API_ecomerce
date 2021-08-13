const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const {createProduct, randomNumber, createOrder} = require ('./utils')

const faker = require ('faker')
faker.locale = 'pt_BR'

const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const testUser2 = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const products = []
let tokenAdmin
const keysOrders = []

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Cria um pedido',()=>{
        beforeAll(async()=>{
            if(singleTest){
                envConfig()
                Database.init()
            }
            // user 1
            await request (app)
                .post('/usuarios/cadastro')
                .send(testUser.data)

            const reqUser = await request (app)
                .post('/usuarios/login')
                .send(testUser.data)
            testUser.token = reqUser.body.token

            //user 2
            await request (app)
                .post('/usuarios/cadastro')
                .send(testUser2.data)

            const reqUser2 = await request (app)
                .post('/usuarios/login')
                .send(testUser2.data)
            testUser2.token = reqUser2.body.token

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
            
            const randomOrders  =  randomNumber(5) 
            const quantOrders = randomOrders === 0 ? 1: randomOrders
            for(let cont=0 ; cont < quantOrders ;cont++){
                const req = await createOrder(testUser,products)
                keysOrders.push(req.body.chave)
            }

        })
        // /pedidos
        it('Não deve acessar os pedidos se não estiver um Token válido', async()=>{
            const req = await request (app)
                .get('/pedidos')
                
            expect(req.status).toBe(401)
        })

        it('Não deve acessar todos pedidos se não estiver um Token admin', async()=>{
            const req = await request (app)
                .get('/pedidos')
                .set('auth',`Bearer ${testUser2.token}`)

            expect(req.status).toBe(404)
        })

        it('Não deve acessar um pedido que pertence a outro cliente', async()=>{
            const random =  randomNumber(keysOrders.length)
            const req = await request (app)
                .get(`/pedidos/${keysOrders[random]}`)
                .set('auth',`Bearer ${testUser2.token}`)

            expect(req.status).toBe(404)
        })

        it('Deve acessar todos pedidos com um Token admin', async()=>{
            const req = await request (app)
                .get('/pedidos')
                .set('auth',`Bearer ${tokenAdmin}`)

            expect(req.status).toBe(200)
        })

        it('Deve acessar um pedido com um Token admin', async()=>{
            const random =  randomNumber(keysOrders.length)
            const req = await request (app)
                .get(`/pedidos/${keysOrders[random]}`)
                .set('auth',`Bearer ${tokenAdmin}`)

            expect(req.status).toBe(200)
        })

        it('Deve acessar um pedido que pertence ao cliente', async()=>{
            const random =  randomNumber(keysOrders.length)
            const req = await request (app)
                .get(`/pedidos/${keysOrders[random]}`)
                .set('auth',`Bearer ${testUser.token}`)

            expect(req.status).toBe(200)
        })
    })
}



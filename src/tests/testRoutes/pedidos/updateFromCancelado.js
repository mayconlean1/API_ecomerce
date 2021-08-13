// teste não finaliza sozinho

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

    return describe('Atualiza para "cancelado" o status dos pedidos',()=>{
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

            const random  =  randomNumber(2) 
            const quantProducts = random === 0 ? 1: random
            for(let cont=0 ; cont < quantProducts ;cont++){
                products.push( await createProduct(tokenAdmin) )
            }
            
            const randomOrders  =  0
            const quantOrders = randomOrders === 0 ? 4: randomOrders
            for(let cont=0 ; cont < quantOrders ;cont++){
                const req = await createOrder(testUser,products)
                keysOrders.push(req.body.chave)
            }

        })
        // /pedidos
        
        it('Deve cancelar os pedidos com o token referente', async()=>{
            const req = await request (app)
                .patch('/pedidos/cancelar')
                .set ('auth',`Bearer ${testUser.token}`)
                .send({id: keysOrders[0]})
            expect(req.status).toBe(200)
        })

        it('Deve cancelar os pedidos com o token referente (id array)', async()=>{
            const req = await request (app)
                .patch('/pedidos/cancelar')
                .set ('auth',`Bearer ${testUser.token}`)
                .send({id: [keysOrders[0],keysOrders[1]] })
            expect(req.status).toBe(200)
        })

        it('Não deve cancelar os pedidos com o token de outro usuario', async()=>{
            const req = await request (app)
                .patch('/pedidos/cancelar')
                .set ('auth',`Bearer ${testUser2.token}`)
                .send({id: [keysOrders[2],keysOrders[3]] })
            expect(req.status).toBe(404)
        })

        it('Não deve cancelar os pedidos com id que não existe', async()=>{
            const req = await request (app)
                .patch('/pedidos/cancelar')
                .set ('auth',`Bearer ${testUser.token}`)
                .send({id: ['not_exists' , keysOrders[3]]})
            const req2 = await request (app)
                .patch('/pedidos/cancelar')
                .set ('auth',`Bearer ${testUser.token}`)
                .send({id: 'not_exists' })

            expect(req.status).toBe(500)
            expect(req2.status).toBe(404)
        })
    })
}



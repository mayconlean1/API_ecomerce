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

const products = []
let tokenAdmin
const keysOrders = []

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Atualiza para "etregue" o status dos pedidos',()=>{
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
        
        it('Deve deletar os pedidos com o token de um admin', async()=>{
            const req = await request (app)
                .del('/pedidos/excluir')
                .set ('auth',`Bearer ${tokenAdmin}`)
                .send({id: keysOrders[0]})
            const req2 = await request (app)
                .del('/pedidos/excluir')
                .set ('auth',`Bearer ${tokenAdmin}`)
                .send({id:[ keysOrders[1],keysOrders[2] ]})

            expect(req.status).toBe(200)
            expect(req2.status).toBe(200)
        })

        it('Não deve deletar os pedidos com o token de usuario', async()=>{
            const req = await request (app)
                .del('/pedidos/excluir')
                .set ('auth',`Bearer ${testUser.token}`)
                .send({id: keysOrders[3]})
           
            expect(req.status).toBe(401)
        })

    })
}



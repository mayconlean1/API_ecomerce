const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const path =require ('path')

const faker = require ('faker')
faker.locale = 'pt_BR'

let tokenAdmin
const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}
const dataProduct = {
    nome: faker.commerce.productName(),
    preco: faker.commerce.price(),
    estoque : Math.trunc( faker.finance.amount() ),
    descricao : faker.commerce.productDescription()
}


module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Adciona imagens de um produto do banco de dados',()=>{
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
            const reqProduto = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${tokenAdmin}`)
                .send(dataProduct)
            dataProduct.key = reqProduto.body.chave
        })

        it('Não deve adicionar imagem do produto com token de usuario', async()=>{
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')

            const req = await request (app)
                .post(`/produtos/${dataProduct.key}`)
                .set('auth',`Bearer ${testUser.token}`)
                .attach('produto_imagem',pathImage1)
                
            expect(req.status).toBe(401)
        })

        it('Não deve adicionar imagem com o id do produto errado', async()=>{

            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            
            const req = await request (app)
                .post(`/produtos/any_key`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .attach('produto_imagem',pathImage1)
                
            expect(req.status).toBe(404)        
        })

        it('Deve adicionar uma imagem no banco de dados', async()=>{

            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            
            const req = await request (app)
                .post(`/produtos/${dataProduct.key}`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .attach('produto_imagem',pathImage1)
                
            expect(req.status).toBe(200)        
        })

        it('Deve adicionar várias imagens no banco de dados', async()=>{

            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            const pathImage2 = path.join(__dirname,'./images/Garrafa_Termica.jpg')
            
            const req = await request (app)
                .post(`/produtos/${dataProduct.key}`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .attach('produto_imagem',pathImage1)
                .attach('produto_imagem',pathImage2)
      
            expect(req.status).toBe(200)        
        })
 
    })

}
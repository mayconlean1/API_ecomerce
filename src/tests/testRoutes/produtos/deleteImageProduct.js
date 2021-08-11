const app = require ('../../../app')
const request = require ('supertest')
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const path =require ('path')

const faker = require ('faker')
const { image } = require('faker')
faker.locale = 'pt_BR'

let tokenAdmin
const testUser = {
    data:{
        email : faker.internet.email(),
        senha : faker.internet.password()
    },
}

const indexProducts = []

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Deleta imagens de um produto do banco de dados',()=>{
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
            for(let cont=0;cont<2;cont++){
                indexProducts.push( await createProductWithImages(tokenAdmin) )
            }
        })

        it('Não deve deletar imagem do produto com token de usuario', async()=>{
            const req = await request (app)
                .post(`/produtos/excluir_imagens/${String(indexProducts[0])}`)
                .set('auth',`Bearer ${testUser.token}`)
                .send({imagens:0})
                
            expect(req.status).toBe(404)
        })

        it('Não deve deletar imagem com o parametro id errado', async()=>{
            const req = await request (app)
                .del(`/produtos/excluir_imagens/any_key`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .send({imagens:0})
                
            expect(req.status).toBe(404)        
        })

        it('Não deve deletar imagem com o body id errado', async()=>{
            const req = await request (app)
                .del(`/produtos/excluir_imagens`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .send({id:'errado', imagens:0})
  
            expect(req.status).toBe(404)        
        })

        it('Deve deletar imagem com o parametro id correto', async()=>{
         
            const req = await request (app)
                .del(`/produtos/excluir_imagens/${String(indexProducts[0])}`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .send({ imagens:0})
            expect(req.status).toBe(200)        
        })

        it('Deve deletar imagem com o body id correto', async()=>{
         
            const req = await request (app)
                .del(`/produtos/excluir_imagens/`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .send({id:String(indexProducts[0]), imagens:0})
            expect(req.status).toBe(200)        
        })

        it('Deve deletar os indices das imagens enviados como um array, utilizando id produto', async()=>{
         
            const req = await request (app)
                .del(`/produtos/excluir_imagens/${String(indexProducts[1])}`)
                .set('auth',`Bearer ${tokenAdmin}`)
                .send({ imagens:[0,1]})
            expect(req.status).toBe(200)        
        })
        // afterAll(async()=>{
        //     for (let i of indexProducts){
        //         await request (app)
        //             .del(`/produtos/excluir_imagens/${String(i)}`)
        //             .set('auth',`Bearer ${tokenAdmin}`)
        //             .send({imagens:[0,1]})
        //     }
        // })
    })
}

async function createProductWithImages(tokenAdmin=''){
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

    const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
    const pathImage2 = path.join(__dirname,'./images/Garrafa_Termica.jpg')

    await request (app)
        .post(`/produtos/${String( reqProduto.body.chave)}`)
        .set('auth',`Bearer ${tokenAdmin}`)
        .attach('produto_imagem',pathImage1)
        .attach('produto_imagem',pathImage2)

    return reqProduto.body.chave
}
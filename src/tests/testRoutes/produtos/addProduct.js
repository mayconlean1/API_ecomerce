const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const faker = require ('faker')
faker.locale = 'pt_BR'

const 
    {createNewUser, 
    login,
    createNewProduct,
    postProduct
} = require ('../../utils/utilsTest')

let testUser = {data:{}}
let testAdmin ={data:{}}

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
            
            testUser.data = await createNewUser()
            testUser.token = await login(testUser.data)
            const [, userAdmin] = await createNewUser('admin')
            testAdmin.data = userAdmin
            const req =  await login(userAdmin)
            testAdmin.token = req.body.token
        },35000)

        it('Não deve ser possivel adicionar um produto como usuario',async ()=>{
            const dataProduct = createNewProduct()
            const req = await postProduct(dataProduct, testUser.token)
            expect(req.status).toBe(401)
        })

        it('Deve ser possivel adicionar um produto como admin',async ()=>{

            const dataProduct = createNewProduct()
            const req = await postProduct(dataProduct, testAdmin.token)
            expect(req.status).toBe(201)
        })

        it('Não deve ser possivel adicionar um produto, com as chaves erradas',async ()=>{

            const dataProduct = {
                nome_chave_errada: faker.commerce.productName(),
                preco_chave_errada: faker.commerce.price(),
                estoque_chave_errada : Math.trunc( faker.finance.amount() ),
                descricao : faker.commerce.productDescription()
            }   
            const req = await postProduct(dataProduct, testAdmin.token)
            expect(req.status).toBe(500)
        })

    })

}
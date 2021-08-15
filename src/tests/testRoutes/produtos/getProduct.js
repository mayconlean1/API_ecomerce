const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')
const {indexRandomArray} = require ('../../../utils/utils')

const {
    login,
    createNewProduct,
    postProduct,
    getProducts
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

            const reqAdminLogin = await login ({
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            })
            tokenAdmin = reqAdminLogin.body.token

            for (let c = 0; c < 3; c++){

                const dataProduct = createNewProduct() 
                const req = await postProduct(dataProduct, tokenAdmin)
                idProducts.push(req.body.chave)
            }
        },40000)

        it ('Deve retornar um JSON de todos os produtos do banco de dados',async()=>{

            const req = await getProducts()
            expect(req.status).toBe(200)
        })

        it('Deve retornar um JSON de um produto especifico', async()=>{

            const randomIndex = indexRandomArray(idProducts)
            const idProduct = idProducts[randomIndex]
            const req = await getProducts(`/${idProduct}`)
            expect(req.status).toBe(200)  
        })

        it('Deve retornar "not found" quando um produto não existe', async()=>{
           
            const req = await getProducts(`/${'notExists'}`)
            expect(req.status).toBe(404)
        })
    })
}
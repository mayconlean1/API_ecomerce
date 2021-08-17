const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')
const path = require ('path')
const fs = require('fs')

const {
    createNewUser,
    login,
    createPostProduct,
    deleteProduct,
    addImageProduct
} = require ('../../utils/utilsTest')


const faker = require ('faker')
faker.locale = 'pt_BR'

let tokenAdmin
const testUser = {data:{}}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Deleta um produto do banco de dados',()=>{
        beforeAll(async()=>{
            if(singleTest){
                envConfig()
                try { 
                    await Database.drop({table: 'usuarios'}) 
                    await Database.drop({table: 'produtos'}) 
                } catch  {}
                await Database.init()
            }
            
            const [reqUser, newUser] = await createNewUser()
            testUser.data = {...newUser}
            testUser.token = reqUser.body.token
            
            const reqAdminLogin = await login({
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            })
            tokenAdmin = reqAdminLogin.body.token

        },25000)

        it('Não deve deletar o produto com token de usuario', async()=>{
            
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const req = await deleteProduct(testUser.token, idProduto)
            expect(req.status).toBe(401)
        })

        it('Não deve deletar o produto sem o id do produto', async()=>{
           
            const req = await deleteProduct(tokenAdmin)
            expect(req.status).toBe(304)
        })

        it('Deve deletar o produto logado como admin', async()=>{
           
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const req = await deleteProduct(tokenAdmin, idProduto)
            expect(req.status).toBe(200)
        })

        it('Deve deletar um array de produtos logado como admin', async()=>{
            const arrayProducts = []
            for(let c = 0 ; c < 3; c++){
                const [reqProduto]= await createPostProduct(tokenAdmin)
                arrayProducts.push( reqProduto.body.chave )
            }
            const req = await deleteProduct(tokenAdmin, arrayProducts)
            expect(req.status).toBe(200)
        })
        
        it('Deve deletar o produto junto com as imagens', async()=>{
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            const pathImage2 = path.join(__dirname,'./images/Garrafa_Termica.jpg')
            
            const reqAddImages = await addImageProduct(idProduto, tokenAdmin, pathImage1, pathImage2)

            await deleteProduct(tokenAdmin, idProduto)

            // Corrgir paths
            const imagesAdd = reqAddImages.body.detalhes.url.map(image => image.replace(/.*\/imagens\//, ''))
            const imagens_path = __dirname.replace(/src.*/, 'imagens')
            //
            
            const images_dir = fs.readdirSync(imagens_path)
            
            const filterImages = imagesAdd.filter(image=>images_dir.includes(image))
            const deletedImages = filterImages.length === 0

            expect(deletedImages).toBe(true)

        })
        
    })

}
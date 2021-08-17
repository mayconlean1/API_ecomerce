const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const path =require ('path')

const {
    createNewUser,
    login,
    createPostProduct,
    addImageProduct
} = require ('../../utils/utilsTest')

let tokenAdmin
const testUser = {data:{}}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Adciona imagens de um produto do banco de dados',()=>{
        beforeAll(async()=>{
            if(singleTest){
                try { 
                    envConfig()
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

        },40000)

        it('Não deve adicionar imagem do produto com token de usuario', async()=>{
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
           
            const req= await addImageProduct(idProduto, testUser.token, pathImage1 )
            expect(req.status).toBe(401)
        })

        it('Não deve adicionar imagem com o id do produto errado', async()=>{
            const idProduto = 'any_key'
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            
            const req= await addImageProduct(idProduto, tokenAdmin, pathImage1 )
                
            expect(req.status).toBe(404)        
        })

        it('Deve adicionar uma imagem no banco de dados', async()=>{
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            
            const req= await addImageProduct(idProduto, tokenAdmin, pathImage1 )
            expect(req.status).toBe(200)        
        })

        it('Deve adicionar várias imagens no banco de dados', async()=>{
            const [reqProduto]= await createPostProduct(tokenAdmin)
            const idProduto = reqProduto.body.chave
            const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
            const pathImage2 = path.join(__dirname,'./images/Garrafa_Termica.jpg')
            
            const req = await addImageProduct(idProduto, tokenAdmin, pathImage1, pathImage2)
      
            expect(req.status).toBe(200)        
        })
    })
}
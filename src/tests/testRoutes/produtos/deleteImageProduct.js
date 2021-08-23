const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')
const fs =require ('fs')

const path =require ('path')

const faker = require ('faker')
faker.locale = 'pt_BR'

const {
    createNewUser,
    login,
    createProductWithImages,
    deleteImageProduct
} = require ('../../utils/utilsTest')

let tokenAdmin
const testUser = {data:{}}

const indexProducts = []

const pathImage1 = path.join(__dirname,'./images/garrafas.jpg')
const pathImage2 = path.join(__dirname,'./images/Garrafa_Termica.jpg')

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Deleta imagens de um produto do banco de dados',()=>{
        beforeAll(async()=>{
            if(singleTest){
                try { 
                    envConfig()
                    await Database.drop({table: 'usuarios'}) 
                    await Database.drop({table: 'produtos'}) 
                } catch  {}
                await Database.init()
            }
           
            const [,newUser] = await createNewUser()
            testUser.data = {...newUser}
            const reqUser = await login(newUser)
            testUser.token = reqUser.body.token
            
            const reqAdminLogin = await login({
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            })
            tokenAdmin = reqAdminLogin.body.token

            //criar produto
            for(let cont=0;cont<2;cont++){
                indexProducts.push( await createProductWithImages(tokenAdmin, pathImage1, pathImage2) )
            }
        },40000)

        it('Não deve deletar imagem do produto com token de usuario', async()=>{
             
            const req = await deleteImageProduct({params:String(indexProducts[0])}, 0 , testUser.token)
            expect(req.status).toBe(401)
        })

        it('Não deve deletar imagem com o parametro id errado', async()=>{
            
            const req = await deleteImageProduct({params:'any_key'}, 0 , tokenAdmin)
            expect(req.status).toBe(404)        
        })

        it('Não deve deletar imagem com o body id errado', async()=>{
           
            const req = await deleteImageProduct({bodyId:'WRONG'}, 0 , tokenAdmin)
            expect(req.status).toBe(404)        
        })

        it('Deve deletar imagem com o parametro id correto', async()=>{
         
            const req = await deleteImageProduct({params: String(indexProducts[0])}, 0 , tokenAdmin)
            expect(req.status).toBe(200)        
        })

        it('Deve deletar imagem com o body id correto', async()=>{
         
            const req = await deleteImageProduct({bodyId: String(indexProducts[0])}, 0 , tokenAdmin)
            expect(req.status).toBe(200)        
        })

        it('Deve deletar os indices das imagens enviados como um array, utilizando id produto', async()=>{
         
            const req = await deleteImageProduct({params: String(indexProducts[0])}, [0,1] , tokenAdmin)
            expect(req.status).toBe(200)        
        })

        afterAll(async()=>{
           
            const BASE_PATH = __dirname.replace(/\\src\\tests\\testRoutes\\produtos/,'')
            const imagesPath = path.join(BASE_PATH,'./imagens')
            const imagesDir = fs.readdirSync(imagesPath)

            try {
                imagesDir.forEach((file,index)=>{
                    if (index !== 0){
                        
                        const imagePath = path.join(BASE_PATH,`./imagens/${file}`)
                        fs.unlinkSync(imagePath)
                    }
                })
                
            } catch (error) {
                console.error('Test Images do not delete', error)
            }
        })
    })
}

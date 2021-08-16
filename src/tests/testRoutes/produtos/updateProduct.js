
const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')

const {
    createNewUser,
    login,
    createNewProduct,
    createPostProduct,
    updateProduct,
} = require ('../../utils/utilsTest')

let tokenAdmin
const testUser = {data:{}}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data
    return describe('Atualizar dados do produto',()=>{
        beforeAll(async()=>{
            if(singleTest){
                envConfig()
                try { 

                    await Database.drop({table: 'usuarios'}) 
                    await Database.drop({table: 'produtos'}) 
                } catch  {}
                await Database.init()
            }
 
            const [,newUser] = await createNewUser()
            testUser.data = {...newUser}
            const reqUser = await login (newUser)
            testUser.token = reqUser.body.token

            const reqAdminLogin = await login({
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            })
            tokenAdmin = reqAdminLogin.body.token 
        },30000)

        it('Não deve atualizar o produto com token de usuario', async()=>{
            
            const [reqProduto] = await createPostProduct(tokenAdmin)
            const newChanges = createNewProduct()
            newChanges.id = reqProduto.body.chave
            const req = await updateProduct(newChanges,testUser.token)
            expect(req.status).toBe(401)
        })

        it('Não deve atualizar o produto sem o id do produto', async()=>{
            
            await createPostProduct(tokenAdmin)
            const newChanges = createNewProduct()
            const req = await updateProduct(newChanges,tokenAdmin)
            expect(req.status).toBe(304)
        })

        it('Deve atualizar o produto logado como admin', async()=>{
           
            const [reqProduto] = await createPostProduct(tokenAdmin)
            const newChanges = createNewProduct()
            newChanges.id = reqProduto.body.chave
            const req = await updateProduct(newChanges,tokenAdmin)
            expect(req.status).toBe(200)
        })
    })
}
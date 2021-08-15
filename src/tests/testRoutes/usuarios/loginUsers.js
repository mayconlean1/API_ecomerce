const Database = require ('../../../Database/init')
const envConfig = require ('../../_envConfig')
const {createNewUser , login} = require ('../../utils/utilsTest')
let userTestData =  {}

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data
    return describe('Logar usuario',()=>{

        beforeAll(async()=>{
            if(singleTest){

                envConfig()
                try { await Database.drop({table: 'usuarios'}) } catch  {}
                await Database.init() 
            }
            const [,user] = await createNewUser()
            userTestData = {...user}
        })

        it('deve logar como usuario',async()=>{

            const req = await login(userTestData)
            expect(req.status).toBe(200)
        })

        it('deve logar como admin', async()=>{

            const data =  {
                email : process.env.ADMIN_EMAIL,
                senha : process.env.ADMIN_PASSWORD
            }
            const req = await login(data)
            expect(req.status).toBe(200)
        })
        
        it('não deve logar com email errado',async()=>{

            const data =  {
                email : 'teste1@emailErrado.com',
                senha : userTestData.senha
            }
            const req = await login(data)
            expect(req.status).toBe(401)
        })

        it('nao deve logar com a senha errada',async()=>{

            const data =  {
                email : userTestData.email,
                senha : 'senha errada'
            }
            const req = await login(data)
            expect(req.status).toBe(401)
        })
    })
}



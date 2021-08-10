const Database = require ('../Database/init')
const envConfig = require ('./_envConfig')

module.exports= (data = {singleTest:false})=>{

    data = {singleTest:false, ...data}
    const {singleTest} = data

    return describe('Inicializa Tabelas do banco de dados', ()=>{
    
        beforeAll(async()=>{
            envConfig()
            if (singleTest){} 
        })

        it('Inicializa as todas tabelas',async()=>{
            await Database.init()
        })

        it ('Deleta as todas tabelas', async()=>{
            await Database.dropAllTables()
        })

        it('Reinicia todas as Tabelas', async()=>{
            await Database.init()

        })
    })
}
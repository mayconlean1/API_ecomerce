const faker = require('faker')
const request = require ('supertest')
const app = require ('../../app')

const utils = {
    async createNewUser(tipo = 'usuario'){
        let data
        let req
        let error = true
        if (tipo === 'admin'){
            const adminData =  {
                    email : process.env.ADMIN_EMAIL,
                    senha : process.env.ADMIN_PASSWORD
                }
            
            const reqAdmin = await utils.login(adminData)
            const token = await reqAdmin.body.token
            data = {
                email : 'admin_'+faker.internet.email(),
                senha : faker.internet.password(),
                tipo : 'admin'
            }

            try {
                req = await request (app)
                    .post('/usuarios/cadastro')
                    .set('auth' , `Bearer ${token}`)
                    .send(data)   
                    error = false 
            } catch (error) {throw Error(error)}
        }else{
            data = {
                email : 'user_'+faker.internet.email(),
                senha : faker.internet.password(),
                tipo : 'usuario'
            }
            try {
                req = await request (app)
                    .post('/usuarios/cadastro')
                    .send(data)
                error = false   
            } catch (error) {throw Error(error)}
        }
        if (!error){
            return [req, data]
        }

    },

    async login(user={}){
        try {
            const req = await request (app)
                .post('/usuarios/login')
                .send(user)
    
            await request (app)
                .post('/usuarios/cadastro')
                .set('auth' , `Bearer ${req.body.token}`)
                .send(user)
            
            return req
        } catch (error) {throw Error(error)}
    },

    createNewProduct(){
        const dataProduct = {
            nome: faker.commerce.productName(),
            preco: (Number( faker.commerce.price()) + Math.random()).toFixed(2),
            estoque : Math.trunc( faker.finance.amount() ),
            descricao : faker.commerce.productDescription()
        }  
        return dataProduct  
    },

    async postProduct(dataProduct={},token=''){
        try {
            const req = await request (app)
                .post('/produtos')
                .set('auth',`Bearer ${token}`)
                .send(dataProduct)
            return req   
        } catch (error) {throw Error(error)}
    },

    async getProducts(idProduct = ''){
        try{
            const req = await request (app)
                .get(`/produtos${idProduct}`)
            return req
        }catch (error) {throw Error(error)}
    }
}

module.exports = utils

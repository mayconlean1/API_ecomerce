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

    async createPostProduct(token=''){
        const newProduct = utils.createNewProduct()
        try{
            const req = await utils.postProduct(newProduct , token)
            return [req , newProduct]     
        }catch (error) {throw Error(error)}
    },

    async updateProduct(dataProduct={} ,token=''){
        try{
            
            const req = await request (app)
                .patch('/produtos')
                .set('auth',`Bearer ${token}`)
                .send(dataProduct)
            return req
        }catch (error) {throw Error(error)}
    },

    async deleteProduct(token='',id= ''){
        try {
                
            const req = await request (app)
                .del('/produtos')
                .set('auth',`Bearer ${token}`)
                .send({id:id===''?undefined:id})
            return req
        } catch (error) {throw Error(error)}
    },

    async deleteImageProduct(indexProduct={params:'',bodyId:''},indexImage='' , token){
        indexProduct = {bodyId:'',params:'', ...indexProduct}
        const sendJson = indexProduct.bodyId !== ''? {id:indexProduct.bodyId, imagens:indexImage} : {imagens:indexImage}
        const req = await request (app)
            .del(`/produtos/excluir_imagens/${indexProduct.params}`)
            .set('auth',`Bearer ${token}`)
            .send(sendJson)
        return req
    },

    async addImageProduct(productKey='any_key',token='',path = '', path2=''){
        try {
            let req
            if (path2 === ''){
                req =  await request (app)
                    .post(`/produtos/${productKey}`)
                    .set('auth',`Bearer ${token}`)
                    .attach('produto_imagem',path)
            }else{
                req =  await request (app)
                    .post(`/produtos/${productKey}`)
                    .set('auth',`Bearer ${token}`)
                    .attach('produto_imagem',path)
                    .attach('produto_imagem',path2)
            }
            return req
            
        } catch (error) {throw Error(error)}
    },

    async createProductWithImages(tokenAdmin='', path='' , path2=''){
        const [reqProduto] = await utils.createPostProduct(tokenAdmin)
    
        await utils.addImageProduct(reqProduto.body.chave,tokenAdmin,path,path2)
    
        return reqProduto.body.chave 
    },

    async getProducts(idProduct = ''){
        try{
            const req = await request (app)
                .get(`/produtos${idProduct}`)
            return req
        }catch (error) {throw Error(error)}
    },

}

module.exports = utils

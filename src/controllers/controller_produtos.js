const fs = require ('fs')
const db = require ('../model/dbDo')
const {nullFieldsBodyProducts} = require('../utils/controllersUtils')
const {isArray , isNumber, basePath} = require('../utils/utils')
const path = require ('path')

const controllerProdutos = {
    async getAll (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes = {
            metodo: 'GET',
            produtos_listados: undefined,
            descricao: 'Retorna todos os produtos'
        }
        
        let getProdutos

        try {
            getProdutos = await db.get( {table: 'produtos'} )
            detalhes.produtos_listados = getProdutos.length
        } catch (error) {
            console.error(error)
            return res.status(500).send({error , detalhes})
        }
        
        const changedIdProduct = {}
        getProdutos.forEach(produto =>{
            changedIdProduct[produto.id] = {...produto}
            delete changedIdProduct[produto.id].id
        })

        return res.status(200).send({produtos: changedIdProduct , detalhes})
    },

    async getSingle (req ,res ,next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo: 'GET',
            descricao: 'retorna o produto com ID pelo parametro'
        }

        const id = req.params.id
        let getDb
        try {
            getDb = await db.get( {table: 'produtos' , where : {id}})
            
        } catch (error) {
            return res.status(500).send({erro: error, detalhes})
        }

        if (Object.keys(getDb).length >0){
            return res.status(200).send({
                produto:{ ...getDb[0]},
                detalhes 
            });
        }else{
            return res.status(404).send({
                erro: 'Produto nao encontrado',
                detalhes
            })
        }
    },

    async post (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'POST',
            descricao : 'Inseri um produto no banco de dados',
            campos : `nome TEXT NOT NULL, preco FLOAT NOT NULL, estoque INT NOT NULL, descricao TEXT`,
            duplicado: Boolean,
            primaryKey: 'identificaçao unica do produto, se duplicado retorna as keys dos produtos iguais'
        }
        // id nome preco estoque     descricao imagens

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if(getUsuario.tipo === 'admin'){

            const data = {
                table: 'produtos' , 
                insert : {
                    nome : req.body.nome, 
                    preco: req.body.preco, 
                    estoque : req.body.estoque,    
                }
            }
    
            if (req.body.descricao !== undefined){
                data.insert.descricao = req.body.descricao
            }
    
            // if (req.body.imagens !== undefined){
            //     data.insert.imagens = req.body.imagens
            // }
        
            let primaryKey
            try {
                primaryKey = await db.insert(data)
        
            } catch (error) {
    
                const checkFields = nullFieldsBodyProducts(req.body)
    
                if (checkFields.length > 0){
                    return res.status(500).send({
                        erro:'Campos Obrgatórios',
                        campos : checkFields,
                        detalhes
                    })
                }
    
                return res.status(500).send({erro: error , detalhes})
            }

            return res.status(201)
            .send({
                mensagem: 'Produto inserido com sucesso',
                chave: primaryKey,
                produto : {
                    ...data.insert
                },
                detalhes
            })

        }else{
            return res.status(401).send({erro:'Não autorizado'})
        }
    },

    async postImage (req, res, next){
        const detalhes = {
            metodo: 'POST',
            descricao: 'Adciona imagens de um produto no banco de dados',
        }
        // console.log( req.files , 'uploadMulter.array') 
        // console.log(req.file, 'uploadMulter.single')

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if(getUsuario.tipo === 'admin'){
            const id = req.params.id
            const images = req.files.map(file => file.filename)
            
            try {
                
                await db.update({table:'produtos',update:{imagens:images} , where:{id:id}})
                
                const URL = process.env.BASE_URL+'/imagens/'
                const urlImages = images.map(image=>URL+image)
    
                return res.status(200).send({
                    mensagem:'Concluído', 
                    detalhes :{ 
                        ...detalhes,
                        url: urlImages
                    }
                })
            } catch (error) {
                // deleta as imagens criadas
                req.files.forEach(file =>{
                    fs.unlinkSync(file.path)
                })
                return res.status(500).send({erro:error,mensagem:'Imagens não foram adicionadas no banco de dados', detalhes})
            } 
            
        }else{
            req.files.forEach(file =>{fs.unlinkSync(file.path)})
            return res.status(401).send({erro:'Não autorizado'})
        }
    },

    async deleteImages (req, res, next){
        const detalhes = { 
            metodo: 'POST',
            descricao: 'Com o id do produto, o metodo deleta imagens de um produto pelo pelo index no array de imagens',
            detalhes:{
                dica:'Pode enviar o id por parametros ou pelo post'
            }
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if(getUsuario.tipo === 'admin'){
            const id = req.params.id || req.body.id
            const deleteImages = req.body.imagens

            let getProdutos
            if(id){
                getProdutos = await db.get( {table: 'produtos', where : {id:id}})
                if(getProdutos.length === 0){
                    return res.status(500).send({erro:'Não existe produto com esse id',detalhes})
                }
            }else{
                return res.status(500).send({erro:'Necessita do id do produto',detalhes})
            }

            let imgUpdated
            let imgDelete
            if(isNumber(deleteImages)){

                const indexImage = Number(deleteImages)
                const productImages = getProdutos[0]['imagens']
                imgUpdated = productImages.filter((img,index) => index!=indexImage)
                imgDelete = productImages.filter((img,index)=> index == indexImage
                )
                
            }else if (isArray(deleteImages)){
                const indexArrayImage = deleteImages
                const productImages = getProdutos[0]['imagens']

                imgUpdated = productImages.filter((img, index)=>{
                    return !indexArrayImage.includes(index) 
                })  
                imgDelete =  productImages.filter((img, index)=>{
                    return indexArrayImage.includes(index) 
                }) 

            }else{
                return res.status(500).send({mensagem:'Não foi deletada nenhuma imagem',detalhes})
            }

            try { // 2 ações apaga bd e apaga arquivo no mesmo trycatch
                await db.update({table: 'produtos' , update:{imagens: imgUpdated}, where: {id:id}}) 
                imgDelete.forEach(img =>{
                    const imgPath = path.join(basePath, './imagens/' + img)
                    fs.unlinkSync( imgPath)
                })
                
            } catch (error) {// 2 ações apaga bd e apaga arquivo no mesmo trycatch
                return res.status(500).send({mensagem:'Não foi deletada nenhuma imagem',detalhes})      
            }

            return res.status(200).send({mensagem:'Imagens Deletadas',detalhes})
            
                
        }else{
            return res.status(401).send({erro:'Não autorizado'})
        }
    },

    async patch (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes =  {
            metodo : 'POST',
            descricao : 'Altera a informmção de um produto com o ID',
            campos : `nome TEXT NOT NULL, preco INT NOT NULL, estoque INT NOT NULL, descricao TEXT, imagens TEXT`
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if(getUsuario.tipo === 'admin'){
    
            const reqbody = req.body
            delete reqbody.imagens
            const body = {...reqbody}
            const id = req.body.id
    
            if (id){
                const getProduct = await db.get( {table: 'produtos' ,where: {id}})
    
                if(getProduct.length === 0){
                    return res.status(404).send({erro:'ID nao encontrado', detalhes })
                }
    
                const data = { table: 'produtos', update : body, where:{id} }
            
                try {
                    await db.update(data)
                } catch (error) {
                    return res.status(500).send({
                        erro: error,
                        detalhes
                    })
                }
            
                return res.status(200).send({
                    mensagem: 'Produto aleterado',
                    produto : body,
                    detalhes  
                })
            }else{
                return res.status(304).send({
                    erro : 'ID do produto',
                    detalhes
                })
            }

        }else{
            return res.status(401).send({erro:'Não autorizado'})
        }
    },

    async del (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes =  {
            metodo : 'POST',
            descricao : 'Deleta um produto no banco de dados pelo ID'
        }
        
        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]
        if(getUsuario.tipo === 'admin'){
            
            const id = req.body.id
            if(id){
                let getProduct
                try {
                    getProduct = await db.get( {table: 'produtos' ,where: {id}})
                    
                } catch (error) {
                    return res.status(500).send({erro: error})
                }

                if(getProduct.length === 0){
                    return res.status(404).send({erro:'ID nao encontrado', detalhes })
                }

                try {
                    await db.delete( {table: 'produtos' , where : {id}} )
                    
                } catch (error) {
                    return res.status(500).send({
                        erro: error,
                        detalhes
                    })
                }
                const productImgs= getProduct[0].imagens
                if(productImgs){
                    try { 
                        productImgs.forEach(img =>{
                            // console.log(path.join(basePath, './imagens/' + img))
                            const imgPath = path.join(basePath, './imagens/' + img)
                            fs.unlinkSync( imgPath)
                        })
                    } catch (error) {
                        return res.status(500).send({erro: error,APIimage:'error',detalhes})
                    }
                }
                // return await controllerProdutos.deleteImages(req , res , next)

                return res.status(200).send({
                    mensagem: 'Produto deletado',
                    detalhes 
                })
                
            }else{
                return res.status(304).send({

                    erro : 'ID do produto',
                    detalhes

                })
        } 
    
        }else{
            return res.status(401).send({erro:'Não autorizado'})
        }
 
    },
}

module.exports = controllerProdutos
const db = require ('../model/dbDo')
const bcrypt = require ('bcrypt')
const jwt = require ('jsonwebtoken')

module.exports = {
    async postCadastro (req, res, next){
        let getUsuarios
        try {
            getUsuarios = await db.get( {table: 'usuarios', where: {email : req.body.email}})
            if(getUsuarios.length > 0){
                return res.status(500).send({erro:'Usuario já cadastrado'})
            }
        } catch {}
    
        bcrypt.hash(req.body.senha, 10,async (errBcrypt, hash)=>{
            if(errBcrypt){return res.status(500).send({erro:errBcrypt})}

            let getUsuario
            let token= false
            try {
                getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
                getUsuario = getUsuario[0]
                
                if (getUsuario === undefined){throw Error()}  
                token = true
            } catch {}

            const body = {}
            body.senha_hash = hash
            body.email = req.body.email
            // body.tipo = req.body.tipo || 'usuario'

            if(token && getUsuario.tipo === 'admin' && req.body.tipo === 'admin'){
                body.tipo = req.body.tipo
            }

            try {
                await db.insert({table: 'usuarios', insert:body})
                return res.status(201).send({mensagem:'Cadastro feito com sucesso'})
         
            } catch (error) {
                return res.status(500).send({erro:error})
            }
        } )
    
    },
    
    async postLogin (req, res, next){
        let getUsuarios
        try {
            getUsuarios = await db.get( {table: 'usuarios', where: {email:req.body.email}})
            if (getUsuarios.length === 0){
                return res.status(401).send({erro:'Falha na autenticação',email:'erro'})    
            }
        } catch (error) {
            return res.status(500).send({erro:error})   
        }
    
        const {senha_hash , id} = getUsuarios[0]
    
        bcrypt.compare(req.body.senha, senha_hash ,(errBcrypt , result)=>{
            if(errBcrypt){
                return res.status(401).send({erro:'Falha na autenticação',bcrypt:''})  
            }
            if(result){
                let token
                try {

                    token = jwt.sign({id:id},process.env.JWT_SECRET
                        ,{expiresIn:'5m'} 
                    ) 
                } catch (error) {
                    return res.status(401).send({erro:'Falha na autenticação', jwt:'sign'})
                }
    
                return res.status(200).send({
                    mensagem:'Login feito com sucesso',
                    token
                })
            }
            return res.status(401).send({erro:'Falha na autenticação',senha:''})  
    
        })
    
    },
}


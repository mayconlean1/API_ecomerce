const jwt = require ('jsonwebtoken')

const required = (req, res, next)=>{
    
    try {
        //headers auth:Bearer (token)
        const [,token] = req.headers.auth.split(' ')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.token = decode
        next()
    } catch (error) {
        return res.status(401).send({erro:'Falha na autenticação'})
    }  
}

const notRequired = (req, res, next)=>{
    try {
        const [,token] = req.headers.auth.split(' ')
        const decode = jwt.verify(token , process.env.JWT_SECRET)
        req.token = decode
        next()
    } catch (error) {
        next()
    }  
}


module.exports = {required, notRequired}
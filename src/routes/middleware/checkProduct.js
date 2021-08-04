const db = require ('../../model/dbDo')

module.exports = async (req, res, next)=>{
    const detalhes = {
        metodo: 'POST',
        descricao: 'Adciona imagens de um produto no banco de dados',
    }
    const id = req.params.id
    try {
        const getProdutos = await db.get( {table: 'produtos', where : {id}})
        if(getProdutos.length === 0){
            return res.status(404).send({erro:'Não foi encontrado o ID do produto', detalhes})
        }
    } catch (error) {
        return res.status(500).send({erro:error, detalhes}) 
    }

    next()
}
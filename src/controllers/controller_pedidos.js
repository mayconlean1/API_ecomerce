const db = require ('../model/dbDo')
const {typeJSON , dbParse, isObject } = require('../utils/utils')
const {returnProdutcsToStock , convertValueOfDate} = require('../utils/controllersUtils')

module.exports = {
    async getAll  (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')

        const detalhes ={
            metodo : 'GET',
            descricao : 'Retorna todos os pedidos'   
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0] 

        let getPedidos
        if(getUsuario.tipo === 'admin'){
            try {
                getPedidos = await db.get( {table: 'pedidos'})
                
            } catch (error) {
                return res.status(500).send({erro : error, detalhes})
            }
        }
        else{
            try {
                getPedidos = await db.get( {table: 'pedidos', where: {contato: getUsuario.email}})
                
            }catch (error) {
                return res.status(500).send({erro : error, detalhes})
            }
        }
        
        if(getPedidos.length === 0){
            return res.status(404).send({mensagem: 'Não foi encontrado nenhum pedido'})
        }
    
        getPedidos.forEach(pedido =>{
            try {
                pedido.data_criacao = convertValueOfDate(pedido.data_criacao)
            } catch (error) {}
            try {
                pedido.data_fechamento = convertValueOfDate(pedido.data_fechamento)
            } catch (error) {}
    
        })
        
        const changedIdOrder = {}
        getPedidos.forEach(pedidos =>{
            changedIdOrder[pedidos.id] = {...pedidos}
            delete changedIdOrder[pedidos.id].id
        })
        
        return res.status(200).send({
            pedidos : changedIdOrder
        })
    },
    
    async getSingle (req ,res ,next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'GET',
            descricao : 'Retorna um pedido com ID pelo parametro'   
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        const id = req.params.id
    
        let getPedido
        if(getUsuario.tipo === 'admin'){
            try {
                getPedido = await db.get( {table: 'pedidos', where: {id}})
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }
            
        }else{
            try {
                getPedido = await db.get( {table: 'pedidos', where: {id , contato: getUsuario.email}})
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }

        }
    
        if(getPedido.length === 0){
            return res.status(404).send({erro: 'Pedido não encontrado' , detalhes})
        }
    
        getPedido.forEach(pedido =>{
            try {
                pedido.data_criacao = convertValueOfDate(pedido.data_criacao)
            } catch (error) {}
            try {
                pedido.data_fechamento = convertValueOfDate(pedido.data_fechamento)
            } catch (error) {}
    
        })
    
        return res.status(200).send({
            mensagem : 'Detalhes do pedido',
            pedido: getPedido[0],
            detalhes
        });
        
    },
    
    async post (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'POST',
            descricao : 'Inseri um pedido no banco de dados',
            campos : `cliente TEXT NOT NULL, contato TEXT NOT NULL,entrega TEXT NOT NULL,produtos TEXT NOT NULL,pagamento TEXT NOT NULL`,
            dicas : {
                campos:{
                    produtos : {
                        exemplo : `{'1': 2, '5':3}`,
                        identificadores : `{ (ID PRODUTO) : (QUANTIDADE DO PRODUTO) }`,
                        resumo : `A chave do objeto (ID PRODUTO) exemplo precisa ter aspas simples e o valor (QUANTIDADE DO PRODUTO) um numero`,
                        nota : 'Pode ser enviado como objeto JSON  {"1" : 3 , "3" : 5} tambem'
                    }
                }
            }
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]
    
        const body = req.body
        const typeProdutos = typeJSON(body.produtos)
    
        if (typeProdutos !== 'db_object' && typeProdutos !== 'object'){
            return res.status(500).send({erro : `Formato campo produto inválido`, detalhes})
        }
        
        // verificar estoque
        const products = typeProdutos === 'object'? body.produtos : dbParse( body.produtos )
        const idProdutcs = Object.keys( products )
        const quantityProducts = Object.values( products )
    
        const tableProducts = await db.get( {table: 'produtos', whereOR:{id : idProdutcs}})
    
        const noStock = tableProducts.filter((product, index) => quantityProducts[index] > product.estoque)
    
        if(noStock.length > 0){
            const noSotckItens = noStock.map((item , index) => ( 
                {
                    id:item.id , 
                    nome: item.nome, 
                    estoque: item.estoque,
                    quantidade_pedido : quantityProducts[index] 
                } 
            ) )
            return res.status(500).send({
                erro: `Produto(s) sem estoque`,
                produtos: noSotckItens,
                detalhes
            })
        }
    
        //Calcular valor Total
        const reduceProducts = tableProducts.reduce((obj , product, index)=>{
            obj.total =  (product.preco * quantityProducts[index]) + obj.total
            obj[product.id] = {}
            obj[product.id].nome = product.nome
            obj[product.id].valor_unitario = product.preco
            obj[product.id].quantidade = quantityProducts[index]
            return obj
        },{total:0})
        const {total , ...dbProducts} = reduceProducts
        //
        
        const pedido = {
            cliente : body.cliente,
            contato : getUsuario.email,
            entrega : body.entrega,
            produtos : dbProducts,
            pagamento : body.pagamento,
            valorTotal : total
        }
    
        let idKey
        try {
            idKey = await db.insert({table: 'pedidos', insert: pedido})
    
        } catch (error) {
            console.error(error )
             return res.status(500).send({erro : error,detalhes}) }
    
        // atualizar estoque no banco de dados Produtos
        const avaibleStock = tableProducts.map(p => p.estoque)
        for(let c = 0 ; c < idProdutcs.length ; c++){
            await db.update ( 
                {
                table:'produtos', 
                update:{estoque :avaibleStock[c] - quantityProducts[c]} , 
                where: { id: idProdutcs[c]}
                } 
            )
        }
    
        return res.status(201).send({
            mensagem: 'O pedido foi criado',
            chave: idKey,
            pedidoCriado: pedido,
            detalhes
        })
    },
    
    async del (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'POST',
            descricao : 'Apaga pedidos do banco dados ',
            campos : `id, data_criacao, status,cliente ,contato ,entrega,produtos ,pagamento,valorTotal `,
            exemplo:{  
                nome: 'Joao',
                status:['entregue','cancelado'],
                dica:'no caso nome será apagado todos com nome "Joao", no caso status será excluido todos os pedidos com status entregue e cancelado'
            }
        }

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if (getUsuario.tipo === 'admin'){

            const body = req.body
            let getPedidos 
            try {
                getPedidos = await db.get( {table: 'pedidos', whereOR: {...body}})
                
            } catch (error) { 
                res.status(500).send({erro: error,detalhes})
            }
            //Retornar Produtos ao estoque
        
            try {
                await returnProdutcsToStock(getPedidos)
                
            } catch (error) {
                res.status(500).send({erro: error , detalhes})
            }
        
            //
        
            try {
                await db.delete( { table:'pedidos' , whereOR: {...body} } )
            } catch (error) {
                res.status(500).send({erro:error , detalhes})
            }
        
            return res.status(201).send({
                mensagem: 'Pedido excluido',
                detalhes
            })
        }else{
            return res.status(401).send({erro: 'Não autorizado'})
        }
        
    },
    
    async patchStatusEntregue (req,res,next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'POST',
            descricao : 'Altera o status de pedidos utilizando o ID para "entregue" no banco de dados',
            alerta : 'Se o status do pedido for ( cancelado ) ou já foi alterado não será modificado'
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
            
            if(id === undefined){
                return res.status(404).send({erro: 'Pedido não encontrado' , detalhes})
            }else if (isObject(id)){
                return res.status(500).send({erro: 'Formato inválido' , detalhes})
            }
        
            let getPedidos 
            try {
                getPedidos = await db.get( {table: 'pedidos', whereOR: {id : id}})
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }
        
            if(getPedidos.length == 0){
                return res.status(404).send({erro: 'ID nao encontrado' , detalhes})
            }
        
            const checkedDateStatusData = getPedidos.filter(pedido => pedido.status != 'cancelado' && pedido.data_fechamento === null)
            const checkedIds = checkedDateStatusData.map(pedido => pedido.id)   
        
            try {
                await db.update( {table: 'pedidos',update:{status:'entregue', data_fechamento:Date.now()} , whereOR : {id : checkedIds}} )
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }
        
            return res.status(200).send({mensagem:'Status do(s) pedido(s) alterados para ( entregue )',pedidos_alterados:checkedIds})
        }else{
            return res.status(401).send({erro:'Não autorizado'}) 
        }
    },
    
    async patchStatusCancelado (req , res , next){
        // console.log(req.token, '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
        const detalhes ={
            metodo : 'POST',
            descricao : 'Altera o status de pedidos utilizando o ID para "cancelado" no banco de dados e retorna a quantidade de produtos ao estoque',
            alerta : 'Se o status do pedido for ( entregue ) ou se já foi alterado não será modificado'
        }
        const id = req.body.id

        let getUsuario
        try{
            getUsuario = await db.get({table: 'usuarios' , where:{id:req.token.id}})
        }catch(error){
            return res.status(500).send({erro: error , detalhes})
        }
        getUsuario = getUsuario[0]

        if(id === undefined){
            return res.status(404).send({erro: 'Pedido não encontrado' , detalhes})
        }else if (isObject(id)){
            return res.status(500).send({erro: 'Formato inválido' , detalhes})
        }

        let getPedidos
        if(getUsuario.tipo === 'admin'){
            try {
                getPedidos = await db.get( {table: 'pedidos', whereOR: {id : id}})
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }
        
            if(getPedidos.length == 0){
                return res.status(404).send({erro: 'ID nao encontrado' , detalhes})
            }
        }else{
            try {
                getPedidos = await db.get( {table: 'pedidos', whereOR: {id : id}})
                getPedidos = getPedidos.filter(order => order.contato === getUsuario.email)
            } catch (error) {
                return res.status(500).send({erro: error , detalhes})
            }
        
            if(getPedidos.length == 0){
                return res.status(404).send({erro: 'ID nao encontrado' , detalhes})
            }
        }
        
        const checkedDateStatusData = getPedidos.filter(pedido => pedido.status != 'entregue' && pedido.data_fechamento === null)
        const checkedIds = checkedDateStatusData.map(pedido => pedido.id)
    
        try {
            await returnProdutcsToStock(getPedidos)
        } catch (error) {
            return res.status(500).send({erro: error , detalhes})
        }
    
        try {
            await db.update( {table: 'pedidos',update:{status:'cancelado',data_fechamento:Date.now()} , whereOR : {id : checkedIds}} )
        } catch (error) {
            return res.status(500).send({erro: error , detalhes})
        }
    
        return res.status(200).send({mensagem:'Status do(s) pedido(s) alterados para ( cancelado ) e produtos retornado ao estoque',pedidos_alterados:checkedIds, detalhes})
    },
}


const db = require ('../model/dbDo')

async function returnProdutcsToStock(order = []){  

    const ordersNotFinished = separeOrdersNotFinished(order)

    if(ordersNotFinished.length > 0){
        const produtos = createObjectStatusProducts(ordersNotFinished)
        const products = createObjectIdproductsAmount(produtos) 
        const returnedProductValues = await returnProductsValues(products)
        await updateTableProdutos(returnedProductValues) 
    }
    
    function separeOrdersNotFinished(orders = []){
        return orders.filter(order => {
            const {status} = order
            const statusFinished = 
                status === 'entregue'   || 
                status === 'cancelado'  
                // || 
                // status === 'finalizado'

            if (!statusFinished){
                return order
            }
        })
    }

    function createObjectStatusProducts(order=[]){

        return  order.reduce((obj, pedido) => {
            obj.push( pedido.produtos )
            return obj

        }, [] )
    }

    function createObjectIdproductsAmount(products = []){
        return  products.reduce((obj ,produto) =>{
        
            for (let key in produto ){
                if(obj[key]){
                    obj[key] += Number( produto[key].quantidade )
                }else{
                    obj[key] = 0
                    obj[key] += Number( produto[key].quantidade )
                }
            }
            return obj
        },{})
    }

    async function returnProductsValues(products = {}){
        const productsIds = Object.keys(products)
        let dbGetProdutos 

        try {
            dbGetProdutos = await db.get( {table: 'produtos', whereOR: {id:productsIds}})
        } catch (error) {
            throw Error(error)
        }
        dbGetProdutos.forEach((product)=>{
            if(product.id in products){
                products[product.id] += product.estoque   
            }  
        })
        return products
    }

    async function updateTableProdutos(products){
        for (let key in products){
            const quant = products[key]
            try {
                await db.update( {table:'produtos',update: {estoque: quant}, where : {id : key}} )
            } catch (error) {
                throw Error (error)
            }
        }
    }        
}

function convertValueOfDate(dbDate=''){
    const date = dbDate
        .replace(/^\s+/gi,'') 
        .replace(/\s+$/gi,'') 
        .replace(/[- :]/gi,',') 
        .split(',') 
        .map(char => Number(char))
    const evalDate = eval( `new Date(Date.UTC(${date}) )` )
    // const stringDate = evalDate.toString()
    const stringDate = evalDate.valueOf()
    return stringDate
}

//insert produtos
function nullFieldsBodyProducts (body){
    // nome preco estoque 
    return [
        'nome' in body? false : 'nome',
        'preco' in body? false : 'preco',
        'estoque' in body? false : 'estoque'            
    ].filter(e => e)
}

module.exports = {returnProdutcsToStock , convertValueOfDate, nullFieldsBodyProducts}
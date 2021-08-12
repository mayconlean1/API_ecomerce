const faker = require('faker')
const request = require ('supertest')
const app = require ('../../../app')

async function createProduct(tokenAdmin=''){
    const dataProduct = {
        nome: faker.commerce.productName(),
        preco: faker.commerce.price(),
        estoque : Math.trunc( faker.finance.amount() ),
        descricao : faker.commerce.productDescription()
    }

    const reqProduto = await request (app)
        .post('/produtos')
        .set('auth',`Bearer ${tokenAdmin}`)
        .send(dataProduct)

    return { id:reqProduto.body.chave,...dataProduct}
}

function randomNumber(maxNumber=0){
    return Number( Math.floor( Math.random()* maxNumber) )
}

function UTCDateDatabase (dateValue = ''){

    const date = dateValue === ''? new Date () : new Date (dateValue)
    const year = '0000'+ date.getUTCFullYear()
    const y = year.slice(-4)
    const mounth = '00'+ date.getUTCMonth()
    const m = mounth.slice(-2)
    const day = '00'+ date.getUTCDate()
    const d = day.slice(-2)

    const hour ='00'+ date.getUTCHours()
    const hr = hour.slice(-2)
    const min = '00'+date.getUTCMinutes()
    const mn = min.slice(-2)
    const sec = '00'+ date.getUTCSeconds()
    const sc = sec.slice(-2)

    const fullDate = [y,m,d].join('-')
    const fullHour = [hr,mn,sc].join(':')

    return `${fullDate} ${fullHour}`

}

module.exports = {createProduct, randomNumber, UTCDateDatabase}
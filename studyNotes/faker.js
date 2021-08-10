const faker = require ('faker')
faker.locale = 'pt_BR'

console.table(
    {
        name: faker.commerce.productName(),
        preco: faker.commerce.price(),
        estoque : Math.trunc( faker.finance.amount() ),
        descricao : faker.commerce.productDescription()
    }    
)
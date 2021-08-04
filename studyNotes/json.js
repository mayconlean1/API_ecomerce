const entrega = {
    endereco : 'Alameda dos Anjos',
    numero:'66',
    bairro: 'Espinhos do sul',
    CEP : '354564156',
    52 : {1 : 3 , 4 : 5}
}
// guardar JSON no bd
const dados = JSON.stringify(entrega).replace(/"/gi, "'")

console.log(dados)
// recuperar JSON do bd
const retirar = JSON.parse(dados.replace(/'/gi, '"'))
console.log(retirar.obj)



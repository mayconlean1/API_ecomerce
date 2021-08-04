// ENGENHARIA REVERSA EXPRESS

function package (){ //express
    const uses = {}  //closure acessada pelo retorno da funcao

    return { // retorna um objeto com funcoes que podem acessar o uses
        use(data ={}){
            const keys = Object.keys(data)
            const values = Object.values(data)
            uses[keys[0]] = values[0]
        },
        getUses (){
            return uses
        }
    }
}

package.teste = function () { // atrela um objeto a uma funcao
    return {funcTeste (){
        return 'ola mundo'
    }}
}

const app = package() // inicia a funcao e armazena o retorno , app agora contem as funcoes use e getUses

app.use(package.teste()) // utiliza a funcao atrelada dentro do retorno do package(agora const app) que modifica uma variavel interna do package

const funcTeste = app.getUses().funcTeste // acessa a funcao criada (package.teste) com a funcao retornada do package e atribui a uma nova constante(funcTeste) tornando ela uma funcao, pois acessou o uses interno do package

console.log( funcTeste() ) // apenas executa a funcao que anteriormente foi atribuida
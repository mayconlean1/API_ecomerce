this.scopoPrincipal = 'Principal'

console.log(this , 'principal')

const obj1 = {
    teste : 'oi',
    funcTeste(){
        console.log(this , 'obj1 funcao comum')
    }
}
obj1.funcTeste()

const obj2 = {
    teste : 'oi',
    funcTeste:()=>{
        console.log(this , 'obj2 funcao arrow')
    }
}
obj2.funcTeste()


function funcTeste1(){
    console.log(this , 'principal funcao comum')
}
funcTeste1()

const funcTeste2 = ()=>{
    console.log(this , 'pricipal funcao arrow')
}
funcTeste2()
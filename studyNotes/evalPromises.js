function evalute(awaitString){
    return new Promise((resolve , reject)=> resolve(eval(awaitString)))
}

function teste1 (){
    return new Promise((resolve , reject)=> {
        setTimeout(()=>{
            resolve('Promise resolvida 1')
        },1000)
    })
}



const teste2 = new Promise((resolve , reject)=>{
    setTimeout(()=>{
        resolve('Promise resolvida 2')
    },2000)
})


(async ()=>{
    // console.log(await teste2)
    console.log( evalute('await teste2'))

})()
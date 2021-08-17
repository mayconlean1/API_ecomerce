async function evalute(awaitString){
    return new Promise(async (resolve , reject)=>  resolve( eval(awaitString)))
}

function teste1 (){
    return new Promise((resolve , reject)=> {
        setTimeout(()=>{
            resolve('Promise resolvida 1')
        },1000)
    })
}

function teste2 (){
    return new Promise((resolve , reject)=> {
        setTimeout(()=>{
            resolve('Promise resolvida 2')
        },500)
    })
}

// let ctxScript = `var EVAL_ASYNC = async function() {
//     return await teste1();
// }`;

(async ()=>{
    // console.log(await evalute('await teste1()'))
    // console.log(eval("(async()=>await teste1())()"))
    // console.log(await teste2())

    eval( 
        `var EVAL_ASYNC = async function() {
            return await teste1();
        }`
     );
   
    console.log(await EVAL_ASYNC())
})()


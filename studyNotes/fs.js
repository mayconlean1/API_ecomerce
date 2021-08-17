const fs = require ('fs')

function promiseReadDir(){
    return new Promise((resolve , reject)=> {
        
            fs.readdir('../imagens',(err, data)=> {
                if(err){throw Error(err)}
                resolve( console.log(data) )
            })
    })
}

(async()=>{
    console.log(fs.readdirSync('../imagens'), 'exec')
    const teste1 = promiseReadDir()
    await teste1
    console.log('exec1')
})()


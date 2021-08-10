
(async ()=>{
    function teste1 (){
        return new Promise((resolve , reject)=> {
            setTimeout(()=>{
                resolve('Promise resolvida 1')
            },1000)
        })
    }
    function teste2 (){
        return new Promise((resolve , reject)=> {setTimeout(()=>resolve('Promise resolvida 2'),500)})
    }
   
    const teste3 =  new Promise((resolve , reject)=> {setTimeout(()=>resolve('Promise resolvida 3'),250)})
    
    console.log(teste3)
    const all = await Promise.all([
        teste1() , teste2(), teste3
    ])

    const race = await Promise.race([
        teste1(), teste2(), teste3
    ])


    console.log(all)
    console.log(race)
    console.log(all[0])
    console.log(teste3 , 'fim')

})()
// como chamar metodos a partir do axios?

const axios = require ('axios') // npm install axios

async function getUrl(){
    const {data} = await axios(`http://localhost:3000/`)
    console.log(
        data
    ) 
}

getUrl()
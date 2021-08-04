const express = require ('express');
const app = express()
const morgan = require ('morgan')

const rotaProdutos = require ('./routes/produtos')
const rotaPedidos= require ('./routes/pedidos')
const rotaUsuarios = require ('./routes/usuarios')

// app.use('public',)
app.use(morgan('dev'))
app.use (express.urlencoded({extended:false})); //apenas dados simples
app.use(express.json()); // aceita somente json de no body

app.use((req, res, next)=>{ //config CORS
    // * esta permiitindo todos servidores se for usar especifico (http://...)
    res.header('Acess-Control-Allow-Origin', '*');
    res.header(
        'Acess-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (res.method === 'OPTIONS'){
        res.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next ();
})

app.use('/imagens',express.static("imagens"));  
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos)
app.use ('/usuarios', rotaUsuarios)

//Quando não encontra rota entra aqui
app.use((req, res, next)=>{
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro)
});

app.use ((error, req, res, next)=>{
    res.status (error.status || 500);
    return res.send ({
        erro:{
            mensagem: error.message
        }
    })
});

module.exports = app;
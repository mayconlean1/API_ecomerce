const express = require ('express');
const router = express.Router();
const controllerUsuarios = require( '../controllers/controller_usuarios' )
const authLogin = require ('./middleware/authlogin')

//app.js ROTA /usuarios

router.post('/cadastro',authLogin.notRequired, controllerUsuarios.postCadastro)

router.post('/login',authLogin.notRequired, controllerUsuarios.postLogin)

module.exports = router
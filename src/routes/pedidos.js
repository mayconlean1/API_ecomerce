const express = require ('express');
const router = express.Router();
const authLogin = require ('./middleware/authlogin')
const controllerPedidos = require ('../controllers/controller_pedidos')

//RETORNA TODOS OS PEDIDOS
router.get('/',authLogin.required, controllerPedidos.getAll );

//RETORNA OS DADOS DE UM PEDIDO
router.get('/:id', authLogin.required, controllerPedidos.getSingle );

//INSERI UM PEDIDO
router.post('/', authLogin.required, controllerPedidos.post );

//EXCLUI UM PEDIDO
router.delete('/excluir', authLogin.required, controllerPedidos.del);

//CONCLUI PEDIDO
router.patch('/entregue', authLogin.required, controllerPedidos.patchStatusEntregue)

//CANCELA PEDIDO
router.patch('/cancelar',authLogin.required, controllerPedidos.patchStatusCancelado )

module.exports = router
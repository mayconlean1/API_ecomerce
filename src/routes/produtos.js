const express = require ('express');
const router = express.Router();
const authLogin = require ('./middleware/authlogin')
const controllerProdutos = require ('../controllers/controller_produtos')

const uploadMulter = require ('../utils/multerConfig')
const checkProduct = require ('./middleware/checkProduct')

//RETORNA TODOS OS PRODUTOS
router.get('/', authLogin.notRequired, controllerProdutos.getAll);

//RETORNA OS DADOS DE UM PRODUTO
router.get('/:id', authLogin.notRequired, controllerProdutos.getSingle);

//INSERI UM PRODUTO
router.post('/',authLogin.required ,controllerProdutos.post);

//INSERI IMAGENS DE UM PRODUTO
router.post('/:id',authLogin.required,
checkProduct,
uploadMulter.array('produto_imagem'),
controllerProdutos.postImage
);

//DELETA IMAGENS DE UM PRODUTO
router.delete('/excluir_imagens/:id?',authLogin.required,controllerProdutos.deleteImages)

//ALTERA UM PRODUTO
router.patch('/',authLogin.required, controllerProdutos.patch);

//EXCLUI UM PRODUTO
router.delete('/',authLogin.required, controllerProdutos.del);

module.exports = router
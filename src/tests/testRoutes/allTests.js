initTables = require ('../initTables')
const createUsers = require ('./usuarios/createUser')
const loginUsers = require ('./usuarios/loginUsers')
const addProduct = require ('./produtos/addProduct')
const getProduct = require ('./produtos/getProduct')
const updateProduct = require ('./produtos/updateProduct')
const deleteProduct = require ('./produtos/deleteProduct')
const addImageProduct = require ('./produtos/addImageProduct')
const deleteImageProduct = require ('./produtos/deleteImageProduct')
const createrOrder = require ('./pedidos/createrOrder')
const getOrder = require ('./pedidos/getOrder')
const updateFromEntregue= require ('./pedidos/updateFromEntregue')
const updateFromCancelado = require ('./pedidos/updateFromCancelado')
const deleteOrder = require ('./pedidos/deleteOrder')
module.exports = {
    initTables,
    createUsers,
    loginUsers,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    addImageProduct,
    deleteImageProduct,
    createrOrder,
    getOrder ,
    updateFromEntregue,
    updateFromCancelado,
    deleteOrder
}
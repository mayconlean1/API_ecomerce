const initTables = require ('../initTables')
const createUsers = require ('./usuarios/createUser')
const loginUsers = require ('./usuarios/loginUsers')
const addProduct = require ('./produtos/addProduct')
const getProduct = require ('./produtos/getProduct')
const updateProduct = require ('./produtos/updateProduct')
const deleteProduct = require ('./produtos/deleteProduct')
const addImageProduct = require ('./produtos/addImageProduct')
const deleteImageProduct = require ('./produtos/deleteImageProduct')

module.exports = {
    initTables,
    createUsers,
    loginUsers,
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    addImageProduct,
    deleteImageProduct
}